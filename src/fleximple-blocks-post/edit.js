import { __ } from '@wordpress/i18n';
import { BlockControls, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	BaseControl,
	FocalPointPicker,
	PanelBody,
	Placeholder,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

import PostPreview from './components/post-preview';
import PostSelectControl from './components/post-select-control';
import PostSortableControl from './components/post-sortable-control';
import HeadingLevelDropdown from 'fleximple-components/components/heading-level-dropdown';
import HeadingLevelToolbar from 'fleximple-components/components/heading-level-toolbar';
import ResponsiveSettingsTabPanel from 'fleximple-components/components/responsive-settings-tab-panel';
import Spinner from 'fleximple-components/components/spinner';
import { setResponsiveAttribute } from '../utils';
import './editor.scss';

function getImageSizes(media) {
	if (!media) return;
	const sizes = media.media_details.sizes;
	return Object.keys(sizes)
		.sort()
		.map((key) => ({
			label: key.charAt(0).toUpperCase() + key.slice(1),
			value: key,
		}))
		.reverse();
}

export default function PostEdit({
	attributes,
	attributes: {
		postId,
		postType,
		headingLevel,
		excerptLength,
		extraArticles,
		noFollow,
		noReferrer,
		imageSize,
		aspectRatio,
		focalPoint,
		displayMedia,
		displayFeaturedImage,
		displayExcerpt,
		displayReadMore,
		displayExtraArticles,
		readMore,
	},
	setAttributes,
	clientId,
}) {
	const instanceId = useInstanceId(PostEdit);

	useEffect(() => {
		if (!attributes.className) {
			setAttributes({ className: 'is-style-standard' });
		}
	}, []);

	useEffect(() => {
		setAttributes({ blockId: clientId });
	}, [clientId]);

	const post = useSelect(
		(select) => {
			if (!postType) return;
			return select(coreStore).getEntityRecord('postType', postType, postId);
		},
		[postId]
	);

	const { media } = useSelect(
		(select) => {
			if (!post || !post.featured_media || !displayFeaturedImage) {
				return { media: null };
			}

			const { getMedia } = select(coreStore);

			return {
				media: getMedia(post.featured_media, {
					context: 'view',
				}),
			};
		},
		[post?.featured_media, displayFeaturedImage]
	);

	const blockProps = useBlockProps({
		'data-post-id': postId ? postId : null,
	});

	const blockControls = (
		<BlockControls>
			<HeadingLevelDropdown
				minLevel={2}
				maxLevel={5}
				selectedLevel={headingLevel}
				onChange={(value) => setAttributes({ headingLevel: value })}
				isCollapsed={false}
			/>
		</BlockControls>
	);

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={__('Main', 'fleximple-blocks-post')}>
				<PostSelectControl {...{ attributes, setAttributes }} instanceId={instanceId} />
				<BaseControl
					label={__('Heading level', 'fleximple-blocks-post')}
					id={`fleximple-blocks-post-heading-control-${instanceId}`}
				>
					<HeadingLevelToolbar
						id={`fleximple-blocks-post-heading-control-${instanceId}`}
						minLevel={1}
						maxLevel={7}
						selectedLevel={headingLevel}
						onChange={(value) => setAttributes({ headingLevel: value })}
						isCollapsed={false}
					/>
				</BaseControl>
				{displayExcerpt && (
					<RangeControl
						label={__('Max number of words in excerpt', 'fleximple-blocks-post')}
						min={10}
						max={100}
						value={excerptLength}
						onChange={(value) => setAttributes({ excerptLength: value })}
					/>
				)}
				<ToggleControl
					label={__('Display extra articles', 'fleximple-blocks-post')}
					checked={!!displayExtraArticles}
					onChange={() => setAttributes({ displayExtraArticles: !displayExtraArticles })}
				/>
				{displayExtraArticles && (
					<RangeControl
						label={__('Extra articles', 'fleximple-blocks-post')}
						min={1}
						max={6}
						value={extraArticles}
						onChange={(value) => setAttributes({ extraArticles: value })}
						required
					/>
				)}
				<ToggleControl
					label={__('“nofollow” attribute', 'fleximple-blocks-post')}
					checked={!!noFollow}
					onChange={() => setAttributes({ noFollow: !noFollow })}
					help={
						!noFollow
							? __(
									'Google search spider should follow the links to this post.',
									'fleximple-blocks-post'
							  )
							: __(
									'Google search spider should not follow the links to this post.',
									'fleximple-blocks-post'
							  )
					}
				/>
				<ToggleControl
					label={__('“noreferrer” attribute', 'fleximple-blocks-post')}
					checked={!!noReferrer}
					onChange={() => setAttributes({ noReferrer: !noReferrer })}
					help={
						!noReferrer
							? __(
									'The browser should send an HTTP referer header if the user follows the hyperlink.',
									'fleximple-blocks-post'
							  )
							: __(
									'The browser should not send an HTTP referer header if the user follows the hyperlink.',
									'fleximple-blocks-post'
							  )
					}
				/>
			</PanelBody>
			{displayMedia && displayFeaturedImage && !!post?.featured_media && (
				<PanelBody title={__('Media', 'fleximple-blocks-post')} initialOpen={false}>
					<ResponsiveSettingsTabPanel initialTabName="small">
						{(tab) => (
							<>
								<SelectControl
									label={__('Image size', 'fleximple-blocks-post')}
									value={imageSize[tab.name]}
									options={[
										{
											label: __('None', 'fleximple-blocks-post'),
											value: 'none',
										},
										...getImageSizes(media),
									]}
									onChange={(value) => {
										setResponsiveAttribute(attributes, setAttributes, 'imageSize', tab.name, value);
									}}
								/>
								<SelectControl
									label={__('Aspect ratio', 'fleximple-blocks-post')}
									value={aspectRatio[tab.name]}
									options={[
										{ label: 'None', value: 'none' },
										{ label: '1:1', value: '1-1' },
										{ label: '5:4', value: '5-4' },
										{ label: '4:3', value: '4-3' },
										{ label: '3:2', value: '3-2' },
										{ label: '16:10', value: '16-10' },
										{ label: '16:9', value: '16-9' },
										{ label: '2:1', value: '2-1' },
										{ label: '3:1', value: '3-1' },
									]}
									onChange={(value) => {
										setResponsiveAttribute(
											attributes,
											setAttributes,
											'aspectRatio',
											tab.name,
											value
										);
									}}
								/>
								<FocalPointPicker
									url={
										media.media_details.sizes[imageSize[tab.name]]
											? media.media_details.sizes[imageSize[tab.name]].source_url
											: null
									}
									value={focalPoint[tab.name]}
									onChange={(value) => {
										setResponsiveAttribute(
											attributes,
											setAttributes,
											'focalPoint',
											tab.name,
											value
										);
									}}
								/>
							</>
						)}
					</ResponsiveSettingsTabPanel>
				</PanelBody>
			)}
			<PanelBody title={__('Display', 'fleximple-blocks-post')} initialOpen={false}>
				<PostSortableControl {...{ attributes, setAttributes }} />
				{!!displayReadMore && (
					<TextControl
						label={__('Read more text', 'fleximple-blocks-post')}
						value={readMore}
						onChange={(value) => setAttributes({ readMore: value })}
					/>
				)}
			</PanelBody>
		</InspectorControls>
	);

	return (
		<>
			{blockControls}
			{inspectorControls}
			{!post ? (
				<Placeholder className="fleximple-components-placeholder">
					<Spinner size="medium" />
					<p style={{ marginInline: 'auto' }}>{__('Loading…', 'fleximple-blocks-post')}</p>
				</Placeholder>
			) : (
				<PostPreview post={post} media={media} blockProps={blockProps} {...{ attributes }} />
			)}
		</>
	);
}
