import * as ss from 'superstruct';

export const StatisticsModel = ss.object({
	totalConvertedToUSD: ss.number(),
	totalConversions: ss.number()
});

export type Statistics = ss.Infer<typeof StatisticsModel>;