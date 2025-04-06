import { ApiErrorCode, ApplicationError } from '~/ApplicationError';
import type { ApplicationConfig } from '~/config/loadConfig';
import { Conversion, ConversionModel } from '~/models/Conversion';
import type { StatisticsService } from '~/services/StatisticsService';
import { assertModel } from '~/utils/superstruct';

export class FixerController {
	public constructor(
		private readonly config: ApplicationConfig,
		private readonly statisticsService: StatisticsService
	) {}

	public async convert({
		baseCurrency,
		conversionCurrency,
		amount
	}: Conversion) {
		// check input
		assertModel({
			baseCurrency,
			conversionCurrency,
			amount
		}, ConversionModel);

		// convert
		const response = await fetch(`${this.config.api.endpoint}/convert?access_key=${this.config.api.key}&from=${baseCurrency}&to=${conversionCurrency}&amount=${amount}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		});

		const { result, error } = await response.json();

		if (error) {
			throw new ApplicationError({
				apiErrorCode: ApiErrorCode.UNKNOWN,
				httpStatusCode: 500,
				publicMessage: error.info ?? 'Fixer api error'
			});
		}

		// update conversions
		this.statisticsService.update({ name: 'statistics' }, {
			$inc: {
				totalConversions: 1
			}
		});

		return result as number;
	}
}