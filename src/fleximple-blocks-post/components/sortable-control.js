import { arrayMoveImmutable } from 'array-move';
import { SortableHandle } from 'react-sortable-hoc';
import { interactionIcons } from 'fleximple-components/components/icons';

import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

export const DragHandle = SortableHandle(() => {
	return (
		<div className="fleximple-components-sortable-control__drag-handle">
			<Icon icon={interactionIcons.dragHandle} />
		</div>
	);
});

export const getHelpText = (attribute, state) => {
	switch (attribute) {
		case 'additional':
			return state === 'hidden'
				? __('Display additional content', 'fleximple-blocks-post')
				: __('Hide additional content', 'fleximple-blocks-post');
		case 'audio':
			return state === 'hidden'
				? __('Display audio', 'fleximple-blocks-post')
				: __('Hide audio', 'fleximple-blocks-post');
		case 'author':
			return state === 'hidden'
				? __('Display author', 'fleximple-blocks-post')
				: __('Hide author', 'fleximple-blocks-post');
		case 'categories':
			return state === 'hidden'
				? __('Display categories', 'fleximple-blocks-post')
				: __('Hide categories', 'fleximple-blocks-post');
		case 'comments':
			return state === 'hidden'
				? __('Display comments', 'fleximple-blocks-post')
				: __('Hide comments', 'fleximple-blocks-post');
		case 'content':
			return state === 'hidden'
				? __('Display content', 'fleximple-blocks-post')
				: __('Hide content', 'fleximple-blocks-post');
		case 'date':
			return state === 'hidden'
				? __('Display date', 'fleximple-blocks-post')
				: __('Hide date', 'fleximple-blocks-post');
		case 'excerpt':
			return state === 'hidden'
				? __('Display excerpt', 'fleximple-blocks-post')
				: __('Hide excerpt', 'fleximple-blocks-post');
		case 'extraArticles':
			return state === 'hidden'
				? __('Display extra articles', 'fleximple-blocks-post')
				: __('Hide extra articles', 'fleximple-blocks-post');
		case 'featuredImage':
			return state === 'hidden'
				? __('Display featured image', 'fleximple-blocks-post')
				: __('Hide featured image', 'fleximple-blocks-post');
		case 'heading':
			return state === 'hidden'
				? __('Display heading', 'fleximple-blocks-post')
				: __('Hide heading', 'fleximple-blocks-post');
		case 'icon':
			return state === 'hidden'
				? __('Display icon', 'fleximple-blocks-post')
				: __('Hide icon', 'fleximple-blocks-post');
		case 'media':
			return state === 'hidden'
				? __('Display media', 'fleximple-blocks-post')
				: __('Hide media', 'fleximple-blocks-post');
		case 'meta':
			return state === 'hidden'
				? __('Display meta', 'fleximple-blocks-post')
				: __('Hide meta', 'fleximple-blocks-post');
		case 'quote':
			return state === 'hidden'
				? __('Display quote', 'fleximple-blocks-post')
				: __('Hide quote', 'fleximple-blocks-post');
		case 'readMore':
			return state === 'hidden'
				? __('Display read more', 'fleximple-blocks-post')
				: __('Hide read more', 'fleximple-blocks-post');
		case 'reference':
			return state === 'hidden'
				? __('Display reference', 'fleximple-blocks-post')
				: __('Hide reference', 'fleximple-blocks-post');
		case 'subhead':
			return state === 'hidden'
				? __('Display subhead', 'fleximple-blocks-post')
				: __('Hide subhead', 'fleximple-blocks-post');
		case 'title':
			return state === 'hidden'
				? __('Display title', 'fleximple-blocks-post')
				: __('Hide title', 'fleximple-blocks-post');
	}
};

export const getLabel = (attribute) => {
	switch (attribute) {
		case 'additional':
			return __('Additional content', 'fleximple-blocks-post');
		case 'author':
			return __('Author', 'fleximple-blocks-post');
		case 'audio':
			return __('Audio', 'fleximple-blocks-post');
		case 'categories':
			return __('Categories', 'fleximple-blocks-post');
		case 'comments':
			return __('Comments', 'fleximple-blocks-post');
		case 'content':
			return __('Content', 'fleximple-blocks-post');
		case 'date':
			return __('Date', 'fleximple-blocks-post');
		case 'excerpt':
			return __('Excerpt', 'fleximple-blocks-post');
		case 'extraArticles':
			return __('Extra articles', 'fleximple-blocks-post');
		case 'featuredImage':
			return __('Featured image', 'fleximple-blocks-post');
		case 'heading':
			return __('Heading', 'fleximple-blocks-post');
		case 'icon':
			return __('Icon', 'fleximple-blocks-post');
		case 'media':
			return __('Media', 'fleximple-blocks-post');
		case 'meta':
			return __('Meta', 'fleximple-blocks-post');
		case 'quote':
			return __('Quote', 'fleximple-blocks-post');
		case 'readMore':
			return __('Read more', 'fleximple-blocks-post');
		case 'reference':
			return __('Reference', 'fleximple-blocks-post');
		case 'subhead':
			return __('Subhead', 'fleximple-blocks-post');
		case 'title':
			return __('Title', 'fleximple-blocks-post');
	}
};

export const getState = (attribute, attributes) => {
	const displayAttribute = `display${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`;
	return attributes[displayAttribute];
};

export const toggleAttribute = (attribute, attributes, setAttributes) => {
	const displayAttribute = `display${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`;
	setAttributes({ [displayAttribute]: !attributes[displayAttribute] });
};

export const onSortStart = () => {
	document.body.setAttribute('style', 'cursor:grabbing');
};

export const onSortEnd = ({ oldIndex, newIndex }, _, attributeName, attribute, setAttributes) => {
	document.body.removeAttribute('style');
	const order = arrayMoveImmutable(attribute, oldIndex, newIndex);
	setAttributes({ [attributeName]: order });
};
