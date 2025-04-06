import * as ss from 'superstruct';

export const StatisticsModel = ss.object({
	totalConversions: ss.number()
});

export type Statistics = ss.Infer<typeof StatisticsModel>;