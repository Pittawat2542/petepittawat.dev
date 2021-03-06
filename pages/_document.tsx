import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang='en'>
				<Head>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link
						rel='preconnect'
						href='https://fonts.gstatic.com'
						crossOrigin='anonymous'
					/>
					<link
						href='https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;700&family=Noto+Serif+Thai:wght@400;700&display=swap'
						rel='stylesheet'
					/>
					<link
						rel='stylesheet'
						href='https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css'
						integrity='sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC'
						crossOrigin='anonymous'
					/>
				</Head>
				<body className='dark:bg-neutral-900 dark:text-white'>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
