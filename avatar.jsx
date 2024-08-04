/** @format */

import { Avatar, Button, Box, Slider } from "@material-ui/core";
import { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";

const App = () => {
  var editor = "";
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 10,
    croppedImg:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png",
  });

  const handleSlider = (event) => {
    setPicture({
      ...picture,
      zoom: value,
    });
  };

  const handleCancel = () => {
    setPicture({
      ...picture,
      cropperOpen: false,
    });
  };

  const setEditorRef = (ed) => {
    editor = ed;
  };

  const handleSave = (e) => {
    if (setEditorRef) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();

      setPicture({
        ...picture,
        img: null,
        cropperOpen: false,
        croppedImg: croppedImg,
      });
    }
  };

  const handleFileChange = (e) => {
    let url = URL.createObjectURL(e.target.files[0]);
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true,
    });
  };

  return (
    <div>
      <Box display="flex">
        <Box width="35%">
          <Avatar
            src={picture.croppedImg}
            style={{ width: "100%", height: "auto", padding: "5" }}
          />
          <Button
            variant="contained"
            width="100%"
            style={{ backgroundColor: "red", color: "white" }}
          >
            hola
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </Button>
        </Box>

        {picture.cropperOpen && (
          <Box display="block">
            <AvatarEditor
              ref={setEditorRef}
              image={picture.img}
              width={300}
              height={300}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              rotate={0}
              scale={picture.zoom / 10}
              borderRadius={150}
            />
            <Slider
              value={picture.zoom}
              defaultValue={picture.zoom}
              min={10}
              max={50}
              onChange={(e) => handleSlider(e)}
            />
            <Box>
              <Button variant="contained" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default App;
