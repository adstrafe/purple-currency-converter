import { StatisticsService } from '~/services/StatisticsService';

export class StatisticsController {
	public constructor(
		private readonly statisticsService: StatisticsService
	) {} 
	
	public async getStatistics() {
		const { totalConversions } = await this.statisticsService.getSingle({ name: 'statistics' });
		return totalConversions;
	}
}