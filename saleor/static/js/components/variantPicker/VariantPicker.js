import _ from 'lodash';
import $ from 'jquery';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import React, { Component, PropTypes } from 'react';

import AttributeSelectionWidget from './AttributeSelectionWidget';
//import QuantityInput from './QuantityInput';
import * as queryString from 'query-string';

export default observer(class VariantPicker extends Component {
  static propTypes = {
    onAddToCartError: PropTypes.func.isRequired,
    onAddToCartSuccess: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    variantAttributes: PropTypes.array.isRequired,
    variants: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    const { variants } = this.props;

    const variant = variants.filter(v => !!Object.keys(v.attributes).length)[0];
    const params = queryString.parse(location.search);

    let selection = {};
    if (Object.keys(params).length) {
      Object.keys(params)
        .some((name) => {
          const valueName = params[name];
          const attribute = this.matchAttributeBySlug(name);
          const value = this.matchAttributeValueByName(attribute, valueName);
          if (attribute && value) {
            selection[attribute.pk] = value.pk.toString();
          } else {
            // if attribute doesn't exist - show variant
            selection = variant ? variant.attributes : {};
            // break
            return true;
          }
        });
    } else if (Object.keys(variant).length) {
      selection = variant.attributes;
    }

    let disabledValue = this.matchVariantFromSelection(selection);
    this.state = {
      errors: {},
      quantity: 1,
      selection: selection,
      param_file_disabled: disabledValue,
      upload_file: null
    };
  }

  checkVariantAvailability = () => {
    const { store } = this.props;
    return store.variant.availability;
  };

  handleAddToCart = () => {
    const { onAddToCartSuccess, onAddToCartError, store } = this.props;
    const { quantity, upload_file } = this.state;

    if (quantity > 0 && !store.isEmpty) {
      var formData = new FormData();

      formData.append('quantity', quantity)
      formData.append('variant', store.variant.id)
      formData.append('upload_file', upload_file)

      $.ajax({
        url: this.props.url,
        method: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: () => {
          onAddToCartSuccess();
        },
        error: (response) => {
          onAddToCartError(response);
        }
      });
    }
  };

  handleAttributeChange = (attrId, valueId) => {
    this.setState({
      selection: Object.assign({}, this.state.selection, { [attrId]: valueId })
    }, () => {
      let disabledValue = this.matchVariantFromSelection(this.state.selection);
      this.setState({ param_file_disabled: disabledValue })
      let params = {};
      Object.keys(this.state.selection)
        .forEach(attrId => {
          const attribute = this.matchAttribute(attrId);
          const value = this.matchAttributeValue(attribute, this.state.selection[attrId]);
          if (attribute && value) {
            params[attribute.slug] = value.slug;
          }
        });
      history.pushState(null, null, '?' + queryString.stringify(params));
    });
  };

  handleQuantityChange = (event) => {
    this.setState({ quantity: parseInt(event.target.value) });
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    this.setState({ upload_file: file })
  };

  matchAttribute = (id) => {
    const { variantAttributes } = this.props;
    const match = variantAttributes.filter(attribute => attribute.pk.toString() === id);
    return match.length > 0 ? match[0] : null;
  };

  matchAttributeBySlug = (slug) => {
    const { variantAttributes } = this.props;
    const match = variantAttributes.filter(attribute => attribute.slug === slug);
    return match.length > 0 ? match[0] : null;
  };

  matchAttributeValue = (attribute, id) => {
    const match = attribute.values.filter(attribute => attribute.pk.toString() === id);
    return match.length > 0 ? match[0] : null;
  };

  matchAttributeValueByName = (attribute, name) => {
    const match = attribute ? attribute.values.filter(value => value.slug === name) : [];
    return match.length > 0 ? match[0] : null;
  };

  matchVariantFromSelection(selection) {
    const { store, variants } = this.props;
    let matchedVariant = null;
    variants.forEach(variant => {
      if (_.isEqual(selection, variant.attributes)) {
        matchedVariant = variant;
      }
    });
    store.setVariant(matchedVariant);

    const disabledValue = !matchedVariant.needupload;
    return disabledValue
  }

  render() {
    const { store, variantAttributes } = this.props;
    const { errors, selection, quantity, param_file_disabled, upload_file } = this.state;
    const disableAddToCart = store.isEmpty || !this.checkVariantAvailability();

    const addToCartBtnClasses = classNames({
      'btn primary': true,
      'disabled': disableAddToCart
    });

    return (
      <div>
        <AttributeSelectionWidget
          errors={errors.upload_file}
          variantAttributes={variantAttributes}
          selection={selection}
          handleAttributeChange={this.handleAttributeChange}
          param_file_disabled={param_file_disabled}
          handleFileChange={this.handleFileChange}
        />
        <div className="clearfix">
          <div className="form-group">
            <button
              className={addToCartBtnClasses}
              onClick={this.handleAddToCart}
              disabled={disableAddToCart}>
              {pgettext('Product details primary action', 'Add to cart')}
            </button>
          </div>
        </div>
      </div>
    );
  }
});
