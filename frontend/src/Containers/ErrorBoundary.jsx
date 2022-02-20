import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
		};
	}

	render() {
		const { hasError } = this.state;
		const { children } = this.props;
		if (hasError) {
			return (
				<div className="error_block">
					Что-то пошло не так!
				</div>
			);
		}
		if (!hasError) {
			return (
				children
			);
		}
	}
}

export default ErrorBoundary;
