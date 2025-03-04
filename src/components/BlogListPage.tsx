import { useState } from 'react';

type BlogListPageProps = {
	posts: {
		id: string;
		body: string;
		slug: string;
		collection: string;
		data: {
			title: string;
			excerpt: string;
			tags: string[];
			pubDate: Date;
			coverImage?: {
				src: string;
				width: number;
				height: number;
				format: string;
			};
		};
	}[];
	tags: string[];
};

export default function BlogListPage({
	posts,
	tags,
}: Readonly<BlogListPageProps>) {
	const [selectedTag, setSelectedTag] = useState('All');
	const filteredPosts =
		selectedTag === 'All'
			? posts
			: posts.filter((post) => post.data.tags.includes(selectedTag));

	return (
		<section className='mx-auto w-fit flex flex-col md:mx-4 xl:mx-32 2xl:mx-64'>
			<p className='italic text-end'>{filteredPosts.length} entries</p>
			<hr className='block h-[1px] border-0 border-t mt-2 p-0 border-t-zinc-600' />
			<div className='mt-4 flex flex-wrap gap-2 justify-center max-w-5xl 2xl:max-w-6xl'>
				{tags.map((tag) => (
					<button
						className={`color:var(--white) inline-block px-2 py-1 text-sm bg-zinc-600 first:bg-inherit first:border-2 first:border-zinc-300 text-zinc-100 min-w-12 rounded-lg mb-2 transition-colors duration-200 ease-in-out hover:bg-slate-300 hover:text-zinc-900${
							selectedTag === tag
								? ' first:bg-zinc-300 first:hover:bg-zinc-300 bg-slate-300 hover:bg-slate-300 cursor-not-allowed text-zinc-900'
								: ''
						}`}
						key={tag}
						onClick={() => setSelectedTag(tag)}
					>
						{tag}
					</button>
				))}
			</div>
			<hr className='block h-[1px] border-0 border-t mt-2 mb-4 p-0 border-t-zinc-600' />
			<ul className='columns-1 lg:columns-2 2xl:columns-3 gap-6 md:gap-8 py-4 mt-4 max-w-5xl mx-auto'>
				{filteredPosts.map((post) => (
					<li
						className='mx-auto pointer border border-zinc-600 shadow-xl rounded-3xl hover:bg-zinc-700 hover:-translate-y-2 mb-6 md:mb-8 break-inside-avoid-column transition-all duration-100 ease-in-out md:max-w-lg lg:max-w-md w-auto hyphens-auto'
						key={post.data.title}
					>
						<a
							className='flex flex-col align-middle p-6 h-full'
							href={`/blog/${post.slug}/`}
						>
							<img
								className='rounded-xl mb-6'
								src={post.data.coverImage?.src}
								alt=''
							/>
							<h4 className='text-2xl md:text-3xl font-bold mb-4'>
								{post.data.title}
							</h4>
							<p className='italic'>
								Published on{' '}
								<time dateTime={post.data.pubDate.toISOString()}>
									{post.data.pubDate.toLocaleDateString('en-us', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
									})}
								</time>
							</p>
							<p className='mt-4 text-justify leading-6'>{post.data.excerpt}</p>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}
