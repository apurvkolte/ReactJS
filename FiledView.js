import React from "react";
import FiledList from "./FiledList";
import Link from 'next/link'
class FiledView extends React.Component {
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
        // console.log("productDetails", productDetails);
        // this.props.history.location.state = productDetails
        // console.log("1234", this.props.history.location.state);

        return (
            <div className="content">
                <Link href={{ state: productDetails }} onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    {/* <div className="row" style={{ marginTop: 20 }}> */}
                    <div className="p-10">
                        <FiledList
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
export default FiledView;