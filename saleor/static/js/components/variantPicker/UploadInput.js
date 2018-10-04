import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class UploadInput extends Component {
    static propTypes = {
        handleChange: PropTypes.func.isRequired,
        needupload: PropTypes.bool.isRequired
    }

    render() {
        return (
            <div className="variant-picker">
                <div className="variant-picker__label" htmlFor="id_param">Parameter File</div>
                <input
                    id="id_file"
                    type="file"
                    accept="text/csv, aplication/zip, text/plain"
                    onChange={this.props.handleChange}
                />
            </div>
        )
    }
}
