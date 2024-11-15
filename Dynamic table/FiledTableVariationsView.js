import React from "react";
import FiledListVariations from "./FiledListVariations";

class FiledTableVariationsView extends React.Component {
    state = {
        productVariation: [
            {
                id: Math.random(),
                columns: ""
            }
        ]
    };

    handleChange = e => {
        if (["columns"].includes(e.target.name)) {
            let productVariation = [...this.state.productVariation];
            productVariation[e.target.dataset.id][e.target.name] = e.target.value;
            this.setState({ productVariation });
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    };

    addNewRow = e => {
        this.setState(prevState => ({
            productVariation: [
                ...prevState.productVariation,
                {
                    id: Math.random(),
                    columns: ""
                }
            ]
        }));
    };

    clickOnDelete = (record) => {
        this.setState({
            productVariation: this.state.productVariation.filter(r => r !== record)
        });
    };

    render() {
        let { productVariation } = this.state;

        return (
            <div className="content p-10" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <FiledListVariations
                    add={this.addNewRow}
                    delete={this.clickOnDelete}
                    productVariation={productVariation}
                    handleChange={this.handleChange}
                />
            </div>
        );
    }
}

export default FiledTableVariationsView;
