import { useAsyncMemo } from '~/hooks/useAsyncMemo';

export interface CurrenciesResponse {
	currencies: string[];
}

export function useCurrencies(apiEndpoint: string) {
	return useAsyncMemo<CurrenciesResponse>(async signal => {
		const call = await fetch(`${apiEndpoint}/currencies`, {
			signal,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		});

		if (!call.ok) {
			throw new Error('Failed to fetch currencies');
		}

		return call.json();
	}, []);
}
