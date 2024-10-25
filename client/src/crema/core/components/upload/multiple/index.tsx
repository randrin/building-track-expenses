import { CloudUploadOutlined } from "@ant-design/icons";
import jwtAxios from "@crema/services/auth/jwt-auth";
import { Avatar, Badge, Col, Row, message } from "antd";
import Resizer from "react-image-file-resizer";
import { useIntl } from "react-intl";
import {
  TAM_UPLOAD_DELETE_URL,
  TAM_UPLOAD_SINGLE_URL,
} from "utils/end-points.utils";

const MultipleFileUpload = ({ items, setItems }) => {
  // Desctructing
  const { messages } = useIntl();

  // Functions
  const handleOnChange = async (e: any) => {
    // Resize
    const files = e.target.files;
    console.log(files, items.attachments);

    const allUploadedFiles = items?.attachments || [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          async (uri) => {
            const file = new FormData();
            file.append("file", files[i]);
            await jwtAxios
              .post(TAM_UPLOAD_SINGLE_URL, file, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                console.log(res);

                allUploadedFiles.push(res.data);
                setItems({ ...items, attachments: allUploadedFiles });
              })
              .catch((error) => {
                console.log(
                  "MultipleFileUpload -> handleOnChange Error: ",
                  error
                );
                message.error(error.response.data.message);
              });
          },
          "base64"
        );
      }
    }
    // Send back to server to upload to cloudinary
    // Set url to images[] in the parent component - ProductCreate
  };

  const handleImageRemove = async (public_id) => {
    await jwtAxios
      .delete(`${TAM_UPLOAD_DELETE_URL}/${public_id.split("/")[1]}`)
      .then((res) => {
        const { attachments } = items;
        // Remove the delete element to items files
        let filteredImages = attachments.filter((item) => {
          return item.public_id !== public_id;
        });
        setItems({ ...items, attachments: filteredImages });
      })
      .catch((error) => {
        console.log("MultipleFileUpload -> handleImageRemove Error: ", error);
        message.error(error.response.data.message);
      });
  };

  // Render
  return (
    <Row>
      <Col
        xs={24}
        lg={24}
        className="tt-expenses-without-padding"
        style={{ display: "contents" }}
      >
        {items?.attachments?.map((image) => (
          <>
            <Badge key={image.public_id} className="ml-8">
              <Avatar
                key={image.public_id}
                src={image.url}
                size={100}
                shape="square"
                className="m-3"
              />
            </Badge>
            <span
              className="tt-expenses-cursor-pointer tt-expenses-btn-remove-image"
              onClick={() => handleImageRemove(image.public_id)}
            >
              X
            </span>
          </>
        ))}
        <label className="tt-expenses-btn-upload">
          <CloudUploadOutlined
            size={30}
            className="tt-expenses-btn-upload-icon"
          />
          {messages["common.upload.file"] as string}
          <input
            className="ant-upload-drag-icon"
            type="file"
            multiple
            hidden
            accept="image/*"
            onChange={handleOnChange}
          />
        </label>
      </Col>
    </Row>
  );
};

export default MultipleFileUpload;
