import React from "react";
import FiledList1 from "./FiledList1";

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
            this.setState({ productDetails });
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

    clickOnDelete = (record) => {
        this.setState({
            productDetails: this.state.productDetails.filter(r => r !== record)
        });
    };

    render() {
        let { productDetails } = this.state;

        if (this.props.productField && typeof this.props.productField === 'object') {
            Object.assign(this.state.productDetails, this.props.productField);

            Object.keys(this.props.productField).forEach(key => delete this.props.productField[key]);
        }

        return (
            <div className="content p-10" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <FiledList1
                    add={this.addNewRow}
                    delete={this.clickOnDelete}
                    productDetails={productDetails}
                    handleChange={this.handleChange}
                />
            </div>
        );
    }
}

export default FiledView1;
