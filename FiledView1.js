import React from "react";
import FiledList1 from "./FiledList1";
import Link from 'next/link'

class FiledView1 extends React.Component {
    state = {
        productDetails: [
            {
                id: Math.random(),
                title: "",
                description: ""
            }
        ]
    };

    handleChange = e => {
        if (["title", "description"].includes(e.target.name)) {
            let productDetails = [...this.state.productDetails];
            productDetails[e.target.dataset.id][e.target.name] = e.target.value;
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    };

    addNewRow = e => {
        this.setState(prevState => ({
            productDetails: [
                ...prevState.productDetails,
                {
                    id: Math.random(),
                    title: "",
                    description: ""
                }
            ]
        }));
    };

    deteteRow = id => {
        this.setState({
            productDetails: this.state.productDetails.filter(
                (s, sid) => id !== sid
            )
        });
    };

    clickOnDelete(record) {
        this.setState({
            productDetails: this.state.productDetails.filter(r => r !== record)
        });
    }

    render() {
        let { productDetails } = this.state;

        Object.assign(this.state.productDetails, this.props.productField);
        Object.keys(this.props.productField).forEach(key => delete this.props.productField[key]);

        // console.log("this.props.history.location.state", productDetails);
        // console.log("productDetailsV", this.props.productField);

        // this.props.history.location.state = productDetails

        return (
            <div className="content">
                <Link href="javascript:void(0)" onSubmit={this.handleSubmit} onChange={this.handleChange} replace>
                    {/* <div className="row" style={{ marginTop: 20 }}> */}
                    <div className="p-10">
                        <FiledList1
                            add={this.addNewRow}
                            delete={this.clickOnDelete.bind(this)}
                            productDetails={productDetails}
                        />
                    </div>
                </Link>
            </div>
        );
    }
}
export default FiledView1;