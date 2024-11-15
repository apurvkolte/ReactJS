import React from "react";
import FiledListVariations1 from "./FiledListVariations1";

class FiledTableVariationsView1 extends React.Component {
    state = {
        productFieldVariation: [
            {
                id: Math.random(),
                columns: ""
            }
        ]
    };

    handleChange = e => {
        if (["columns"].includes(e.target.name)) {
            let productFieldVariation = [...this.state.productFieldVariation];
            productFieldVariation[e.target.dataset.id][e.target.name] = e.target.value;
            this.setState({ productFieldVariation });
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    };

    addNewRow = e => {
        this.setState(prevState => ({
            productFieldVariation: [
                ...prevState.productFieldVariation,
                {
                    id: Math.random(),
                    columns: ""
                }
            ]
        }));
    };

    clickOnDelete = (record) => {
        this.setState({
            productFieldVariation: this.state.productFieldVariation.filter(r => r !== record)
        });
    };

    render() {
        let { productFieldVariation } = this.state;

        if (this.props.productFieldVariation && typeof this.props.productFieldVariation === 'object') {
            Object.assign(this.state.productFieldVariation, this.props.productFieldVariation);

            Object.keys(this.props.productFieldVariation).forEach(key => delete this.props.productFieldVariation[key]);
        }

        return (
            <div className="content p-10" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <FiledListVariations1
                    add={this.addNewRow}
                    delete={this.clickOnDelete}
                    productFieldVariation={productFieldVariation}
                    handleChange={this.handleChange}
                />
            </div>
        );
    }
}

export default FiledTableVariationsView1;
