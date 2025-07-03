import AsyncSelect from 'react-select/async';

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { BaseControl, SelectControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

function parsePostTypes(types) {
	if (!types) return [];

	const typesObjectToArray = Object.keys(types).map((type) => {
		return types[type];
	});
	return typesObjectToArray.map((type) => {
		const typeObject = {};
		typeObject.label = type.labels.singular_name;
		typeObject.value = type.slug;
		return typeObject;
	});
}

function parseSearchResults(results) {
	if (!results?.length) return [];

	return results.map((result) => ({
		label: result.title.rendered,
		value: result.id,
	}));
}

function PostSelectControl(
	{ attributes: { postType }, setAttributes, hideLabelFromVision, help },
	instanceId
) {
	const postTypes = useSelect((select) => {
		return select(coreStore).getPostTypes({ per_page: 4 });
	}, []);

	const defaultOptions = useSelect((select) => {
		if (!postType) return [];
		const { getEntityRecords } = select(coreStore);
		const query = { per_page: 20 };
		return parseSearchResults(getEntityRecords('postType', postType, query));
	}, []);

	const fetchPromiseOptions = async (inputValue) => {
		const postTypeRestBase = postTypes.find((type) => type.slug === postType).rest_base;
		const searchResults = await apiFetch({
			path: addQueryArgs(`/wp/v2/${postTypeRestBase}`, {
				search: inputValue,
				per_page: 20,
				_fields: 'id,title',
			}),
		});
		return parseSearchResults(searchResults);
	};

	const id = `fleximple-components-post-select-control-${instanceId}`;

	return (
		<>
			<BaseControl
				label={__('Post', 'fleximple-blocks-post')}
				className="fleximple-components-select-control"
				hideLabelFromVision={hideLabelFromVision}
				id={id}
				help={help}
			>
				<AsyncSelect
					className="react-select-container"
					classNamePrefix="react-select"
					cacheOptions
					defaultOptions={defaultOptions}
					loadOptions={fetchPromiseOptions}
					placeholder={__('Search a post…', 'fleximple-blocks-post')}
					onChange={(selectedOption) => setAttributes({ postId: selectedOption.value })}
					loadingMessage={() => __('Loading…', 'fleximple-blocks-post')}
					noOptionsMessage={() => __('No posts found.', 'fleximple-blocks-post')}
				/>
			</BaseControl>
			<SelectControl
				label={__('Post type', 'fleximple-blocks-post')}
				labelPosition="top"
				value={postType}
				options={parsePostTypes(postTypes)}
				onChange={(value) => setAttributes({ postType: value })}
			/>
		</>
	);
}

export default PostSelectControl;
