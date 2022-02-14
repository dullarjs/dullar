import { AnyObject } from "@/types";

const root = window;

// default options
const DEFAULTS = {
	// placement of the popper
	placement: 'bottom',

	gpuAcceleration: true,

	// shift popper from its origin by the given amount of pixels (can be negative)
	offset: 0,

	// the element which will act as boundary of the popper
	boundariesElement: 'viewport',

	// amount of pixel used to define a minimum distance between the boundaries and the popper
	boundariesPadding: 5,

	// popper will try to prevent overflow following this order,
	// by default, then, it could overflow on the left and on top of the boundariesElement
	preventOverflowOrder: ['left', 'right', 'top', 'bottom'],

	// the behavior used by flip to change the placement of the popper
	flipBehavior: 'flip',

	arrowElement: '[x-arrow]',

	arrowOffset: 0,

	// list of functions used to modify the offsets before they are applied to the popper
	modifiers: ['shift', 'offset', 'preventOverflow', 'keepTogether', 'arrow', 'flip', 'applyStyle'],

	modifiersIgnored: [],

	forceAbsolute: false
};
interface Popper{
	modifiers: AnyObject;
	_reference: HTMLElement;
	_popper: HTMLElement;
	_options: AnyObject;
	state: AnyObject;
}
class Popper {
	constructor(reference: AnyObject, popper: AnyObject, options: AnyObject) {
		this._reference = reference.jquery ? reference[0] : reference;
		this.state = {};
		// if the popper variable is a configuration object, parse it to generate an HTMLElement
		// generate a default popper if is not defined
		const isNotDefined = typeof popper === 'undefined' || popper === null;
		const isConfig = popper && Object.prototype.toString.call(popper) === '[object Object]';
		if (isNotDefined || isConfig) {
			this._popper = this.parse(isConfig ? popper : {});
		}
		// otherwise, use the given HTMLElement as popper
		else {
			this._popper = popper.jquery ? popper[0] : popper;
		}
		// with {} we create a new object with the options inside it
		this._options = Object.assign({}, DEFAULTS, options);
		// refactoring modifiers' list
		this._options.modifiers = this._options.modifiers.map((modifier: string) => {
			// remove ignored modifiers
			if (this._options.modifiersIgnored.indexOf(modifier) !== -1) return;
	
			// set the x-placement attribute before everything else because it could be used to add margins to the popper
			// margins needs to be calculated to get the correct popper offsets
			if (modifier === 'applyStyle') {
				this._popper.setAttribute('x-placement', this._options.placement);
			}
	
			// return predefined modifier identified by string or keep the custom one
			return this.modifiers[modifier] || modifier;
		});
		this.state.position = this._getPosition(this._popper);
		setStyle(this._popper, { position: this.state.position, top: 0 });
	
		// fire the first update to position the popper in the right place
		this.update();
		// setup event listeners, they will take care of update the position in specific situations
		this._setupEventListeners();
		return this;
	}
	destroy(): Popper {
		this._popper.removeAttribute('x-placement');
		this._popper.style.left = '';
		this._popper.style.position = '';
		this._popper.style.top = '';
		this._popper.style[getSupportedPropertyName('transform')] = '';
		this._removeEventListeners();
	
		// remove the popper if user explicity asked for the deletion on destroy
		if (this._options.removeOnDestroy) {
			this._popper.remove();
		}
		return this;
	}
	update(): void {
		let data: AnyObject = { instance: this, styles: {} };
	
		// store placement inside the data object, modifiers will be able to edit `placement` if needed
		// and refer to _originalPlacement to know the original value
		data.placement = this._options.placement;
		data._originalPlacement = this._options.placement;
	
		// compute the popper and reference offsets and put them inside data.offsets
		data.offsets = this._getOffsets(this._popper, this._reference, data.placement);
	
		// get boundaries
		data.boundaries = this._getBoundaries(data, this._options.boundariesPadding, this._options.boundariesElement);
	
		data = this.runModifiers(data, this._options.modifiers);
	
		if (typeof this.state.updateCallback === 'function') {
			this.state.updateCallback(data);
		}
	}
	onCreate(callback: (arg: Popper) => void): Popper {
		// the createCallbacks return as first argument the popper instance
		callback(this);
		return this;
	}
	onUpdate(callback: () => void): Popper {
		this.state.updateCallback = callback;
		return this;
	}
	parse(config: AnyObject): HTMLElement {
		const defaultConfig = {
			tagName: 'div',
			classNames: ['popper'],
			attributes: [],
			parent: root.document.body,
			content: '',
			contentType: 'text',
			arrowTagName: 'div',
			arrowClassNames: ['popper__arrow'],
			arrowAttributes: ['x-arrow']
		};
		config = Object.assign({}, defaultConfig, config);
	
		const d = root.document;
	
		const popper = d.createElement(config.tagName);
		addClassNames(popper, config.classNames);
		addAttributes(popper, config.attributes);
		if (config.contentType === 'node') {
			popper.appendChild(config.content.jquery ? config.content[0] : config.content);
		} else if (config.contentType === 'html') {
			popper.innerHTML = config.content;
		} else {
			popper.textContent = config.content;
		}
	
		if (config.arrowTagName) {
			const arrow = d.createElement(config.arrowTagName);
			addClassNames(arrow, config.arrowClassNames);
			addAttributes(arrow, config.arrowAttributes);
			popper.appendChild(arrow);
		}
	
		let parent = config.parent.jquery ? config.parent[0] : config.parent;
	
		// if the given parent is a string, use it to match an element
		// if more than one element is matched, the first one will be used as parent
		// if no elements are matched, the script will throw an error
		if (typeof parent === 'string') {
			parent = d.querySelectorAll(config.parent);
			if (parent.length > 1) {
				console.warn('WARNING: the given `parent` query(' + config.parent + ') matched more than one element, the first one will be used');
			}
			if (parent.length === 0) {
				throw 'ERROR: the given `parent` doesn\'t exists!';
			}
			parent = parent[0];
		}
		// if the given parent is a DOM nodes list or an array of nodes with more than one element,
		// the first one will be used as parent
		if (parent.length > 1 && parent instanceof Element === false) {
			console.warn('WARNING: you have passed as parent a list of elements, the first one will be used');
			parent = parent[0];
		}
	
		// append the generated popper to its parent
		parent.appendChild(popper);
	
		return popper;
	
		function addClassNames(element: HTMLElement, classNames: string[]) {
			classNames.forEach(function (className) {
				element.classList.add(className);
			});
		}
	
		function addAttributes(element: HTMLElement, attributes: string[]) {
			attributes.forEach(function (attribute) {
				element.setAttribute(attribute.split(':')[0], attribute.split(':')[1] || '');
			});
		}
	
	}
	_getPosition(reference: HTMLElement): string {
		// const container: AnyObject = getOffsetParent(reference);
	
		if (this._options.forceAbsolute) {
			return 'absolute';
		}
	
		// Decide if the popper will be fixed
		// If the reference element is inside a fixed context, the popper will be fixed as well to allow them to scroll together
		const isParentFixed = isFixed(reference);
		return isParentFixed ? 'fixed' : 'absolute';
	}
	_getOffsets(popper: HTMLElement, reference: HTMLElement, placement: string): AnyObject {
		placement = placement.split('-')[0];
		const popperOffsets: AnyObject = {};
	
		popperOffsets.position = this.state.position;
		const isParentFixed = popperOffsets.position === 'fixed';
	
		//
		// Get reference element position
		//
		const referenceOffsets = getOffsetRectRelativeToCustomParent(reference, getOffsetParent(popper), isParentFixed);
	
		//
		// Get popper sizes
		//
		const popperRect = getOuterSizes(popper);
	
		//
		// Compute offsets of popper
		//
	
		// depending by the popper placement we have to compute its offsets slightly differently
		if (['right', 'left'].indexOf(placement) !== -1) {
			popperOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - popperRect.height / 2;
			if (placement === 'left') {
				popperOffsets.left = referenceOffsets.left - popperRect.width;
			} else {
				popperOffsets.left = referenceOffsets.right;
			}
		} else {
			popperOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - popperRect.width / 2;
			if (placement === 'top') {
				popperOffsets.top = referenceOffsets.top - popperRect.height;
			} else {
				popperOffsets.top = referenceOffsets.bottom;
			}
		}
	
		// Add width and height to our offsets object
		popperOffsets.width = popperRect.width;
		popperOffsets.height = popperRect.height;
	
		return {
			popper: popperOffsets,
			reference: referenceOffsets
		};
	}
	_setupEventListeners(): void {
		// NOTE: 1 DOM access here
		this.state.updateBound = this.update.bind(this);
		root.addEventListener('resize', this.state.updateBound);
		// if the boundariesElement is window we don't need to listen for the scroll event
		if (this._options.boundariesElement !== 'window') {
			let target: HTMLElement | Window = getScrollParent(this._reference);
			// here it could be both `body` or `documentElement` thanks to Firefox, we then check both
			if (target === root.document.body || target === root.document.documentElement) {
				target = root;
			}
			target.addEventListener('scroll', this.state.updateBound);
			this.state.scrollTarget = target;
		}
	}
	_removeEventListeners(): void {
		// NOTE: 1 DOM access here
		root.removeEventListener('resize', this.state.updateBound);
		if (this._options.boundariesElement !== 'window' && this.state.scrollTarget) {
			this.state.scrollTarget.removeEventListener('scroll', this.state.updateBound);
			this.state.scrollTarget = null;
		}
		this.state.updateBound = null;
	}
	_getBoundaries(data: AnyObject, padding: number, boundariesElement: string | HTMLElement): AnyObject {
		// NOTE: 1 DOM access here
		let boundaries: AnyObject = {};
		let width = 0;
		let height = 0;
		if (boundariesElement === 'window') {
			const body = root.document.body,
				html = root.document.documentElement;
	
			height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
	
			boundaries = {
				top: 0,
				right: width,
				bottom: height,
				left: 0
			};
		} else if (boundariesElement === 'viewport') {
			const offsetParent = getOffsetParent(this._popper);
			const scrollParent = getScrollParent(this._popper);
			const offsetParentRect = getOffsetRect(offsetParent);
	
			// Thanks the fucking native API, `document.body.scrollTop` & `document.documentElement.scrollTop`
			const getScrollTopValue = function (element: HTMLElement) {
				return element == document.body ? Math.max(document.documentElement.scrollTop, document.body.scrollTop) : element.scrollTop;
			}
			const getScrollLeftValue = function (element: HTMLElement) {
				return element == document.body ? Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) : element.scrollLeft;
			}
	
			// if the popper is fixed we don't have to substract scrolling from the boundaries
			const scrollTop = data.offsets.popper.position === 'fixed' ? 0 : getScrollTopValue(scrollParent);
			const scrollLeft = data.offsets.popper.position === 'fixed' ? 0 : getScrollLeftValue(scrollParent);
	
			boundaries = {
				top: 0 - (offsetParentRect.top - scrollTop),
				right: root.document.documentElement.clientWidth - (offsetParentRect.left - scrollLeft),
				bottom: root.document.documentElement.clientHeight - (offsetParentRect.top - scrollTop),
				left: 0 - (offsetParentRect.left - scrollLeft)
			};
		} else {
			if (getOffsetParent(this._popper) === boundariesElement) {
				boundaries = {
					top: 0,
					left: 0,
					right: (boundariesElement as HTMLElement).clientWidth,
					bottom: (boundariesElement as HTMLElement).clientHeight
				};
			} else if (boundariesElement instanceof HTMLElement) {
				boundaries = getOffsetRect(boundariesElement);
			}
		}
		boundaries.left += padding;
		boundaries.right -= padding;
		boundaries.top = boundaries.top + padding;
		boundaries.bottom = boundaries.bottom - padding;
		return boundaries;
	}
	runModifiers(data: AnyObject, modifiers: Array<(arg: AnyObject) => AnyObject>, ends?: string): AnyObject {
		let modifiersToRun = modifiers.slice();
		if (ends !== undefined) {
			modifiersToRun = this._options.modifiers.slice(0, getArrayKeyIndex(this._options.modifiers, ends));
		}
		modifiersToRun.forEach((modifier: (arg: AnyObject) => AnyObject) => {
			if (isFunction(modifier)) {
				data = modifier.call(this, data);
			}
		});
	
		return data;
	}
	isModifierRequired(requesting: string, requested: string): boolean {
		const index = getArrayKeyIndex(this._options.modifiers, requesting);
		return !!this._options.modifiers.slice(0, index).filter((modifier: string) => {
			return modifier === requested;
		}).length;
	}
}

Popper.prototype.modifiers = {};

Popper.prototype.modifiers.applyStyle = function (data: AnyObject) {
	// apply the final offsets to the popper
	// NOTE: 1 DOM access here
	const styles: AnyObject = {
		position: data.offsets.popper.position
	};

	// round top and left to avoid blurry text
	const left = Math.round(data.offsets.popper.left);
	const top = Math.round(data.offsets.popper.top);

	// if gpuAcceleration is set to true and transform is supported, we use `translate3d` to apply the position to the popper
	// we automatically use the supported prefixed version if needed
	let prefixedProperty = "";
	if (this._options.gpuAcceleration && (prefixedProperty = getSupportedPropertyName('transform'))) {
		styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
		styles.top = 0;
		styles.left = 0;
	}
	// othwerise, we use the standard `left` and `top` properties
	else {
		styles.left = left;
		styles.top = top;
	}

	// any property present in `data.styles` will be applied to the popper,
	// in this way we can make the 3rd party modifiers add custom styles to it
	// Be aware, modifiers could override the properties defined in the previous
	// lines of this modifier!
	Object.assign(styles, data.styles);

	setStyle(this._popper, styles);

	// set an attribute which will be useful to style the tooltip (use it to properly position its arrow)
	// NOTE: 1 DOM access here
	this._popper.setAttribute('x-placement', data.placement);

	// if the arrow modifier is required and the arrow style has been computed, apply the arrow style
	if (this.isModifierRequired(this.modifiers.applyStyle, this.modifiers.arrow) && data.offsets.arrow) {
		setStyle(data.arrowElement, data.offsets.arrow);
	}

	return data;
};

Popper.prototype.modifiers.shift = function (data: AnyObject) {
	const placement = data.placement;
	const basePlacement = placement.split('-')[0];
	const shiftVariation = placement.split('-')[1];

	// if shift shiftVariation is specified, run the modifier
	if (shiftVariation) {
		const reference = data.offsets.reference;
		const popper = getPopperClientRect(data.offsets.popper);

		const shiftOffsets: AnyObject = {
			y: {
				start: { top: reference.top },
				end: { top: reference.top + reference.height - popper.height }
			},
			x: {
				start: { left: reference.left },
				end: { left: reference.left + reference.width - popper.width }
			}
		};

		const axis = ['bottom', 'top'].indexOf(basePlacement) !== -1 ? 'x' : 'y';

		data.offsets.popper = Object.assign(popper, shiftOffsets[axis][shiftVariation]);
	}

	return data;
};

Popper.prototype.modifiers.preventOverflow = function (data: AnyObject) {
	const order: string[] = this._options.preventOverflowOrder;
	const popper = getPopperClientRect(data.offsets.popper);

	const check: AnyObject = {
		left: function () {
			let left = popper.left;
			if (popper.left < data.boundaries.left) {
				left = Math.max(popper.left, data.boundaries.left);
			}
			return { left: left };
		},
		right: function () {
			let left = popper.left;
			if (popper.right > data.boundaries.right) {
				left = Math.min(popper.left, data.boundaries.right - popper.width);
			}
			return { left: left };
		},
		top: function () {
			let top = popper.top;
			if (popper.top < data.boundaries.top) {
				top = Math.max(popper.top, data.boundaries.top);
			}
			return { top: top };
		},
		bottom: function () {
			let top = popper.top;
			if (popper.bottom > data.boundaries.bottom) {
				top = Math.min(popper.top, data.boundaries.bottom - popper.height);
			}
			return { top: top };
		}
	};

	order.forEach(function (direction) {
		data.offsets.popper = Object.assign(popper, check[direction]());
	});

	return data;
};

Popper.prototype.modifiers.keepTogether = function (data: AnyObject) {
	const popper = getPopperClientRect(data.offsets.popper);
	const reference = data.offsets.reference;
	const f = Math.floor;

	if (popper.right < f(reference.left)) {
		data.offsets.popper.left = f(reference.left) - popper.width;
	}
	if (popper.left > f(reference.right)) {
		data.offsets.popper.left = f(reference.right);
	}
	if (popper.bottom < f(reference.top)) {
		data.offsets.popper.top = f(reference.top) - popper.height;
	}
	if (popper.top > f(reference.bottom)) {
		data.offsets.popper.top = f(reference.bottom);
	}

	return data;
};
Popper.prototype.modifiers.flip = function (data: AnyObject) {
	// check if preventOverflow is in the list of modifiers before the flip modifier.
	// otherwise flip would not work as expected.
	if (!this.isModifierRequired(this.modifiers.flip, this.modifiers.preventOverflow)) {
		console.warn('WARNING: preventOverflow modifier is required by flip modifier in order to work, be sure to include it before flip!');
		return data;
	}

	if (data.flipped && data.placement === data._originalPlacement) {
		// seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
		return data;
	}

	let placement = data.placement.split('-')[0];
	let placementOpposite = getOppositePlacement(placement);
	const variation = data.placement.split('-')[1] || '';

	let flipOrder: string[] = [];
	if (this._options.flipBehavior === 'flip') {
		flipOrder = [
			placement,
			placementOpposite
		];
	} else {
		flipOrder = this._options.flipBehavior;
	}

	flipOrder.forEach((step: string, index: number) => {
		if (placement !== step || flipOrder.length === index + 1) {
			return;
		}

		placement = data.placement.split('-')[0];
		placementOpposite = getOppositePlacement(placement);

		const popperOffsets = getPopperClientRect(data.offsets.popper);

		// this boolean is used to distinguish right and bottom from top and left
		// they need different computations to get flipped
		const a = ['right', 'bottom'].indexOf(placement) !== -1;

		// using Math.floor because the reference offsets may contain decimals we are not going to consider here
		if (
			a && Math.floor(data.offsets.reference[placement]) > Math.floor(popperOffsets[placementOpposite]) ||
			!a && Math.floor(data.offsets.reference[placement]) < Math.floor(popperOffsets[placementOpposite])
		) {
			// we'll use this boolean to detect any flip loop
			data.flipped = true;
			data.placement = flipOrder[index + 1];
			if (variation) {
				data.placement += '-' + variation;
			}
			data.offsets.popper = this._getOffsets(this._popper, this._reference, data.placement).popper;

			data = this.runModifiers(data, this._options.modifiers, this._flip);
		}
	});
	return data;
};

Popper.prototype.modifiers.offset = function (data: AnyObject) {
	const offset = this._options.offset;
	const popper = data.offsets.popper;

	if (data.placement.indexOf('left') !== -1) {
		popper.top -= offset;
	}
	else if (data.placement.indexOf('right') !== -1) {
		popper.top += offset;
	}
	else if (data.placement.indexOf('top') !== -1) {
		popper.left -= offset;
	}
	else if (data.placement.indexOf('bottom') !== -1) {
		popper.left += offset;
	}
	return data;
};

Popper.prototype.modifiers.arrow = function (data: AnyObject) {
	let arrow = this._options.arrowElement;
	const arrowOffset = this._options.arrowOffset;

	// if the arrowElement is a string, suppose it's a CSS selector
	if (typeof arrow === 'string') {
		arrow = this._popper.querySelector(arrow);
	}

	// if arrow element is not found, don't run the modifier
	if (!arrow) {
		return data;
	}

	// the arrow element must be child of its popper
	if (!this._popper.contains(arrow)) {
		console.warn('WARNING: `arrowElement` must be child of its popper element!');
		return data;
	}

	// arrow depends on keepTogether in order to work
	if (!this.isModifierRequired(this.modifiers.arrow, this.modifiers.keepTogether)) {
		console.warn('WARNING: keepTogether modifier is required by arrow modifier in order to work, be sure to include it before arrow!');
		return data;
	}

	const arrowStyle: AnyObject = {};
	const placement = data.placement.split('-')[0];
	const popper = getPopperClientRect(data.offsets.popper);
	const reference = data.offsets.reference;
	const isVertical = ['left', 'right'].indexOf(placement) !== -1;

	const len = isVertical ? 'height' : 'width';
	const side = isVertical ? 'top' : 'left';
	const altSide = isVertical ? 'left' : 'top';
	const opSide = isVertical ? 'bottom' : 'right';
	const arrowSize = getOuterSizes(arrow)[len];

	//
	// extends keepTogether behavior making sure the popper and its reference have enough pixels in conjuction
	//

	// top/left side
	if (reference[opSide] - arrowSize < popper[side]) {
		data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowSize);
	}
	// bottom/right side
	if (reference[side] + arrowSize > popper[opSide]) {
		data.offsets.popper[side] += (reference[side] + arrowSize) - popper[opSide];
	}

	// compute center of the popper
	const center = reference[side] + (arrowOffset || (reference[len] / 2) - (arrowSize / 2));

	let sideValue = center - popper[side];

	// prevent arrow from being placed not contiguously to its popper
	sideValue = Math.max(Math.min(popper[len] - arrowSize - 8, sideValue), 8);
	arrowStyle[side] = sideValue;
	arrowStyle[altSide] = ''; // make sure to remove any old style from the arrow

	data.offsets.arrow = arrowStyle;
	data.arrowElement = arrow;

	return data;
};


//
// Helpers
//

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @function
 * @ignore
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element: HTMLElement): AnyObject {
	// NOTE: 1 DOM access here
	const _display = element.style.display, _visibility = element.style.visibility;
	element.style.display = 'block'; element.style.visibility = 'hidden';

	// original method
	const styles = root.getComputedStyle(element);
	const x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
	const y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
	const result = { width: element.offsetWidth + y, height: element.offsetHeight + x };

	// reset element styles
	element.style.display = _display; element.style.visibility = _visibility;
	return result;
}

/**
 * Get the opposite placement of the given one/
 * @function
 * @ignore
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement: string) {
	const hash: AnyObject = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
	return placement.replace(/left|right|bottom|top/g, function (matched) {
		return hash[matched];
	});
}

/**
 * Given the popper offsets, generate an output similar to getBoundingClientRect
 * @function
 * @ignore
 * @argument {Object} popperOffsets
 * @returns {Object} ClientRect like output
 */
function getPopperClientRect(popperOffsets: AnyObject) {
	const offsets = Object.assign({}, popperOffsets);
	offsets.right = offsets.left + offsets.width;
	offsets.bottom = offsets.top + offsets.height;
	return offsets;
}

/**
 * Given an array and the key to find, returns its index
 * @function
 * @ignore
 * @argument {Array} arr
 * @argument keyToFind
 * @returns index or null
 */
function getArrayKeyIndex(arr: string[], keyToFind: string) {
	let i = 0;
	let key = "";
	for (key in arr) {
		if (arr[key] === keyToFind) {
			return i;
		}
		i++;
	}
	return null;
}

/**
 * Get CSS computed property of the given element
 * @function
 * @ignore
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element: Element, property: string) {
	// NOTE: 1 DOM access here
	const css: AnyObject = root.getComputedStyle(element, null);
	return css[property];
}

/**
 * Returns the offset parent of the given element
 * @function
 * @ignore
 * @argument {HTMLElement} element
 * @returns {HTMLElement} offset parent
 */
function getOffsetParent(element: HTMLElement): HTMLElement {
	// NOTE: 1 DOM access here
	const offsetParent = element.offsetParent as HTMLElement;
	return offsetParent === root.document.body || !offsetParent ? root.document.documentElement : offsetParent;
}

/**
 * Returns the scrolling parent of the given element
 * @function
 * @ignore
 * @argument {HTMLElement} element
 * @returns {HTMLElement} offset parent
 */
function getScrollParent(element: HTMLElement): HTMLElement {
	const parent = element.parentElement;

	if (!parent) {
		return element;
	}
	if (parent === root.document.documentElement) {
		// Firefox puts the scrollTOp value on `documentElement` instead of `body`, we then check which of them is
		// greater than 0 and return the proper element
		if (root.document.body.scrollTop || root.document.body.scrollLeft) {
			return root.document.body;
		} else {
			return root.document.documentElement;
		}
	}

	// Firefox want us to check `-x` and `-y` variations as well
	if (
		['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 ||
		['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 ||
		['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1
	) {
		// If the detected scrollParent is body, we perform an additional check on its parentElement
		// in this way we'll get body if the browser is Chrome-ish, or documentElement otherwise
		// fixes issue #65
		return parent;
	}
	return getScrollParent(element.parentElement as HTMLElement);

}
/**
 * Check if the given element is fixed or is inside a fixed parent
 * @function
 * @ignore
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element: HTMLElement): boolean {
	if (element === root.document.body) {
		return false;
	}
	if (getStyleComputedProperty(element, 'position') === 'fixed') {
		return true;
	}
	return element.parentElement ? isFixed(element.parentElement) : !!element;
}

/**
 * Set the style to the given popper
 * @function
 * @ignore
 * @argument {HTMLElement} element - Element to apply the style to
 * @argument {Object} styles - Object with a list of properties and values which will be applied to the element
 */
function setStyle(element: HTMLElement, styles: AnyObject) {
	function is_numeric(n: string | number) {
		return (n !== '' && !isNaN(parseFloat(n as string)) && isFinite(n as number));
	}
	Object.keys(styles).forEach(function (prop) {
		let unit = '';
		// add unit if the value is numeric and is one of the following
		if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && is_numeric(styles[prop])) {
			unit = 'px';
		}
		(element.style as AnyObject)[prop] = styles[prop] + unit;
	});
}

/**
 * Check if the given variable is a function
 * @function
 * @ignore
 * @argument {*} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck: unknown) {
	const getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get the position of the given element, relative to its offset parent
 * @function
 * @ignore
 * @param {HTMLElement} element
 * @return {Object} position - Coordinates of the element and its `scrollTop`
 */
function getOffsetRect(element: HTMLElement) {
	const elementRect: AnyObject = {
		width: element.offsetWidth,
		height: element.offsetHeight,
		left: element.offsetLeft,
		top: element.offsetTop
	};

	elementRect.right = elementRect.left + elementRect.width;
	elementRect.bottom = elementRect.top + elementRect.height;

	// position
	return elementRect;
}

/**
 * Get bounding client rect of given element
 * @function
 * @ignore
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element: HTMLElement) {
	const rect = element.getBoundingClientRect();

	// whether the IE version is lower than 11
	const isIE = navigator.userAgent.indexOf("MSIE") != -1;

	// fix ie document bounding top always 0 bug
	const rectTop = isIE && element.tagName === 'HTML'
		? -element.scrollTop
		: rect.top;

	return {
		left: rect.left,
		top: rectTop,
		right: rect.right,
		bottom: rect.bottom,
		width: rect.right - rect.left,
		height: rect.bottom - rectTop
	};
}

/**
 * Given an element and one of its parents, return the offset
 * @function
 * @ignore
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 * @return {Object} rect
 */
function getOffsetRectRelativeToCustomParent(element: HTMLElement, parent: HTMLElement, fixed: boolean) {
	const elementRect = getBoundingClientRect(element);
	const parentRect = getBoundingClientRect(parent);

	if (fixed) {
		const scrollParent = getScrollParent(parent);
		parentRect.top += scrollParent.scrollTop;
		parentRect.bottom += scrollParent.scrollTop;
		parentRect.left += scrollParent.scrollLeft;
		parentRect.right += scrollParent.scrollLeft;
	}

	const rect = {
		top: elementRect.top - parentRect.top,
		left: elementRect.left - parentRect.left,
		bottom: (elementRect.top - parentRect.top) + elementRect.height,
		right: (elementRect.left - parentRect.left) + elementRect.width,
		width: elementRect.width,
		height: elementRect.height
	};
	return rect;
}

/**
 * Get the prefixed supported property name
 * @function
 * @ignore
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase)
 */
function getSupportedPropertyName(property: string) {
	const prefixes = ['', 'ms', 'webkit', 'moz', 'o'];

	for (let i = 0; i < prefixes.length; i++) {
		const toCheck = prefixes[i] ? prefixes[i] + property.charAt(0).toUpperCase() + property.slice(1) : property;
		if (typeof (root.document.body.style as AnyObject)[toCheck] !== 'undefined') {
			return toCheck;
		}
	}
	return "";
}
export default Popper;
