import React from 'react'
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import addresses from '../assets/addresses.json';
import { TextField } from '@material-ui/core';
import IllicoAudio from '../utils/IllicoAudio';
import FormValidator from '../utils/FormValidator';

/**
 * @param {String} addressHelper
 * @param {String} addressError
 * @param {Function} onChange : binding required
 * @param {boolean} useNegativeZIndex
 */
export default class IllicoAddresses extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        }
    }

    componentDidMount() {
        this.setState({loaded:true});
    }

    render() {
    // limit to 10 addresses to display
    const OPTIONS_LIMIT = 15;
    const filterOptions = createFilterOptions({
        limit: OPTIONS_LIMIT
    });

        return (
            <div>
                <Autocomplete id="address_autocomplete" options={addresses} getOptionLabel={(option) => FormValidator.formatAddress(option)} 
                    filterOptions={filterOptions} clearOnEscape onChange={(event, value) => {this.props.onChange(event, value)}}
                        renderInput={(params) => ( 
                        <TextField {...params} id="address" label="Addresse" variant="outlined" style={{zIndex: this.props.useNegativeZIndex ? -1 : 0}}
                        helperText={this.props.addressHelper} error={this.props.addressError}
                        onClick={() => IllicoAudio.playTapAudio()}
                        />)}
                />
            </div>
        )
    }
}