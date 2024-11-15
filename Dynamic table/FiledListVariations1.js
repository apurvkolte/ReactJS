import React from "react";
export var variation = "";

const FiledListVariations1 = (props) => {
    variation = props.productFieldVariation;

    return props.productFieldVariation.map((val, idx) => {
        let columns = `columns-${idx}`;

        return (
            <div className="row hei" key={val.id} style={{ marginBottom: '0.5rem', marginLeft: '3px' }}>
                <div className="col-md-10 wid">
                    <input
                        type="text"
                        className="form-control required"
                        placeholder="Table row"
                        name="columns"
                        data-id={idx}
                        id={columns}
                        value={val.columns}
                        onChange={props.handleChange}
                    />
                </div>

                <div className="col-md-2">
                    {idx === 0 ? (
                        <button
                            onClick={() => props.add()}
                            type="button"
                            className="btn btn-primary addbtn btn-sm text-center"
                        >
                            <i className="fa fa-plus-circle" aria-hidden="true" />
                        </button>
                    ) : (
                        <button
                            className="btn btn-danger addbtn btn-sm"
                            onClick={() => props.delete(val)}
                        >
                            <i className="fa fa-minus" aria-hidden="true" />
                        </button>
                    )}
                </div>
                <br />
            </div>
        );
    });
};

export default FiledListVariations1;
