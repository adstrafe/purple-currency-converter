import { render } from 'preact';

import { ConversionForm } from '~/components/ConversionForm';

import './index.css';

render(
	<ConversionForm apiEndpoint='http://0.0.0.0:8080' />,
	document.getElementById('app-container')!
);
