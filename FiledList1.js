import React from "react";
export var property = ""
const FiledList1 = (props) => {
    property = props.productDetails;
    // var pd = [
    //     {
    //         id: 12123,
    //         title: "abc",
    //         description: "abc"
    //     },
    //     {
    //         id: 2323,
    //         title: "abc1",
    //         description: "abc1"
    //     }
    // ];

    // delete pd[1]
    // console.log("pd", pd);

    return (props.productDetails).map((val, idx) => {
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
                        defaultValue={val.title}
                        required={idx}
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
                        defaultValue={val.description}
                        required={idx}
                    />
                </div>

                <div className="col-md-2">
                    {idx === 0 ? (
                        <button
                            onClick={() => props.add()}
                            type="button"
                            className="btn sp-btn-add py-2 px-3 text-center"
                        >
                            <i className="fa fa-plus-circle" aria-hidden="true" />
                        </button>
                    ) : (
                        <button
                            className="btn btn-danger py-2 px-3 sp-btn-add"
                            onClick={() => {
                                props.delete(val);
                            }}
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
