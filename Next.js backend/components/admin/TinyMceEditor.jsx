import React, { Component } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Global } from "@emotion/react";
var content = "";

class TinyMceEditor extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }


    onChange(e) {
        content = e.target.getContent()
        console.log(e.target.getContent());
    }

    render() {
        return (
            <div>
                <Global

                />
                <Editor
                    apiKey="y7gnmtbsaxnjbgh3405ioqbdm24eit5f0ovek49w8yvq5r9q"
                    initialValue={`${this.props.aboutUs}`}
                    init={{
                        branding: false,
                        height: 500,
                        menubar: true,
                        plugins:
                            "print preview paste searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount ",
                        toolbar:
                            "formatselect | bold italic underline strikethrough | forecolor backcolor blockquote | link image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | undo | redo | blocks |  bold italic forecolor | alignleft aligncenter | alignright alignjustify | bullist numlist outdent indent |  removeformat | help",
                        image_advtab: true
                    }}
                    onChange={(e) => content = e.target.getContent()}
                />
            </div>
        );
    }
}


export { TinyMceEditor };
export { content };

