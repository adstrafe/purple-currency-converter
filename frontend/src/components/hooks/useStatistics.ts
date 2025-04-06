import { useEffect } from 'preact/hooks';

export interface StatisticsResponse {
	totalConversions: number;
}

export function useStatistics(apiEndpoint: string, onResponse: (response: StatisticsResponse) => void) {
	return useEffect((async () => {
		try {
			const call = await fetch(`${apiEndpoint}/statistics`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			});

			if (!call.ok) {
				throw new Error('Failed to fetch totalConversions');
			}

			const response: StatisticsResponse = await call.json();
			onResponse(response);
		}
		catch (ex) {
			console.error(ex);
		}
	}) as never, []);
}
