import React from "react";
export var property = "";

const FiledList1 = (props) => {
    property = props.productDetails;

    return props.productDetails.map((val, idx) => {
        let title = `title-${idx}`,
            description = `description-${idx}`;

        return (
            <div className="row hei" key={val.id}>
                <div className="col-md-5 wid">
                    <input
                        type="text"
                        className="form-control required"
                        placeholder="Title"
                        name="title"
                        data-id={idx}
                        id={title}
                        value={val.title}
                        onChange={props.handleChange}
                    />
                </div>
                <div className="col-md-5 wid">
                    <input
                        type="text"
                        className="form-control required"
                        placeholder="Description"
                        name="description"
                        id={description}
                        data-id={idx}
                        value={val.description}
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
            </div>
        );
    });
};

export default FiledList1;
