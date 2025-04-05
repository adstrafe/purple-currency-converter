import * as ss from 'superstruct';

export const ConversionModel = ss.object({
	baseCurrency: ss.string(),
	conversionCurrency: ss.string(),
	amount: ss.number()
});

export type Conversion = ss.Infer<typeof ConversionModel>;