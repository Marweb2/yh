/** @format */

"use client";
import { Box, Modal, Slider, Button } from "@mui/material";
import AvatarEditor from "react-avatar-editor";

// styles
import styles from "../../../styles/home/profil/ProfilRight.module.css";

// components
import Image from "next/image";
import ClientOnly from "@/components/ClientOnly";
import { isEmpty } from "@/lib/utils/isEmpty";

// react
import { useEffect, useRef, useState } from "react";

// icons
import { CgClose } from "react-icons/cg";
import { HiUserPlus } from "react-icons/hi2";
import { IoIosArrowRoundBack } from "react-icons/io";

// controllers
import base64 from "@/lib/controllers/base64.controller";

//  redux
import { useSelector } from "react-redux";

let editor = "";

export default function ProfilRight({
  newImage,
  setNewImage,
  newBio,
  setNewBio,
  isSubmit,
  isLoadingPhotos,
  initialPhotos,
  setInfosToUpdate,
  isPhoto,
  setIsPhoto,
}) {
  const { user } = useSelector((state) => state.user);

  const ref = useRef();
  const container = useRef();

  const firstPhoto = !isEmpty(newImage.obj) ? newImage.obj[0] : null;

  const [srcImg, setSrcImg] = useState(
    !isEmpty(newImage.obj) ? newImage.obj[0] : null
  );
  const [ancImg, setAncImg] = useState({ obj: null, value: false });
  const [newPhoto, setNewPhoto] = useState("");
  const [sbc, setSbc] = useState(false);
  const [cantUpload, setCantUpload] = useState(false);
  const [activeCh, setActiveCh] = useState(false);
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 10,
    croppedImg: "",
  });
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    setNewImage((a) => {
      return {
        ...a,
        obj: [srcImg, ...a.obj],
      };
    });
  }, [srcImg]);

  useEffect(() => {
    // bio
    if (
      (user.bio !== newBio.obj?.trim() && newBio.obj?.trim()?.length > 5) ||
      (user.bio !== newBio.obj?.trim() && isEmpty(newBio.obj?.trim()))
    ) {
      if (!newBio.value) {
        setNewBio((prev) => ({ ...prev, value: true }));
      }
      setInfosToUpdate((prev) => ({ ...prev, bio: newBio.obj }));
    } else if (
      (newBio.obj?.trim()?.length < 5 && !isEmpty(newBio.obj?.trim())) ||
      newBio.obj?.trim() === user.bio
    ) {
      if (newBio.value) {
        setNewBio((prev) => ({ ...prev, value: false }));
      }
      setInfosToUpdate((prev) => {
        const { bio, ...nwe } = prev;
        return nwe;
      });
    }

    // photos
    if (JSON.stringify(initialPhotos) !== JSON.stringify(newImage.obj)) {
      if (!newImage.value) {
        setNewImage((prev) => ({
          ...prev,
          value: true,
        }));
      }
      setInfosToUpdate((prev) => ({ ...prev, image: newImage.obj }));
      const newFirstPhoto = !isEmpty(newImage.obj) ? newImage.obj[0] : null;
      setSrcImg(newFirstPhoto);
    } else if (JSON.stringify(initialPhotos) === JSON.stringify(newImage.obj)) {
      if (newImage.value) {
        setNewImage((prev) => ({
          ...prev,
          value: false,
        }));
      }
      setSbc(false);
      setInfosToUpdate((prev) => {
        const { image, ...nwe } = prev;
        return nwe;
      });
      const newFirstPhoto = !isEmpty(newImage.obj) ? newImage.obj[0] : null;
      setSrcImg(newFirstPhoto);
      setCantUpload(false);
    }
  }, [newBio.obj, newImage.obj]);

  useEffect(() => {
    if (activeCh) {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setAncImg({ obj: null, value: false });
          setActiveCh(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [activeCh]);

  useEffect(() => {
    if (isPhoto) {
      const handleClickOutside = (e) => {
        if (container.current && !container.current.contains(e.target)) {
          setIsPhoto(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isPhoto]);

  const setEditorRef = (ed) => {
    editor = ed;
  };
  const handleChangeFile = async (e) => {
    if (e.target.files && e.target.files?.length > 0) {
      let res = URL.createObjectURL(e.target.files[0]);
      setPicture({
        ...picture,
        img: res,
        cropperOpen: true,
      });

      setSbc(true);
      setNewPhoto(res);
      setAncImg({ obj: null, value: false });
    }
  };

  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const boxStyle = {
    background: "white",
    padding: "16px",
    borderRadius: "8px",
  };

  const removeCurrentFile = () => {
    if (!isEmpty(firstPhoto)) {
      if (!isEmpty(newPhoto)) {
        setNewPhoto("");
        setSbc(false);
      }
      setNewImage((prev) => {
        let nwe = { ...prev };
        const newArrayImg = nwe.obj.filter((f) => f !== firstPhoto);
        nwe.obj = newArrayImg;
        return nwe;
      });
    }
  };

  const handleSelection = () => {
    setActiveCh(true);
    setAncImg({ obj: srcImg, value: false });
  };

  const handleChImg = (value) => {
    setSrcImg(value);
    setAncImg({ obj: null, value: true });
    setActiveCh(false);
    setCantUpload(true);
    setNewImage((prev) => {
      let nwe = { ...prev };
      let newArray = [...initialPhotos];
      const indexToMove = newArray.indexOf(value);
      if (indexToMove !== -1) {
        newArray.splice(indexToMove, 1);
      }
      newArray.unshift(value);
      nwe.obj = newArray;
      return nwe;
    });
  };
  const handleSlider = (event, value) => {
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
  const handleSave = (e) => {
    if (setEditorRef) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();
      setSrcImg(croppedImg);

      setPicture({
        ...picture,
        img: null,
        cropperOpen: false,
        // croppedImg: croppedImg,
      });
      setNewImage((prev) => {
        let nwe = { ...prev };
        nwe.obj[0] = croppedImg;
        return nwe;
      });
    }
  };
  return (
    <ClientOnly>
      <div
        ref={container}
        style={{
          justifyContent: "center",
        }}
        className={
          isPhoto
            ? isSubmit
              ? `${styles.container} pen scr`
              : `${styles.container} scr`
            : isSubmit
            ? `${styles.container} ${styles.iph} scr pen`
            : `${styles.container} ${styles.iph} scr`
        }
      >
        <i onClick={() => setIsPhoto(true)} className={styles.ui}>
          <HiUserPlus size="2rem" />
        </i>
        <i onClick={() => setIsPhoto(false)} className={styles.rw}>
          <IoIosArrowRoundBack size="2rem" />
        </i>
        <section>
          {!picture.cropperOpen && (
            <div className={styles.btn}>
              {/* {cantUpload ? (
              <label className={styles.lbd}>Importer une nouvelle photo</label>
            ) : (
              <>
                
              </>
            )} */}
              <label htmlFor="file">Importer une nouvelle photo</label>
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                id="file"
                onChange={handleChangeFile}
              />
            </div>
          )}
          {picture.cropperOpen ? (
            <Modal sx={modalStyle} open={picture.cropperOpen}>
              <Box sx={boxStyle} display="block" justifyContent={"center"}>
                <AvatarEditor
                  ref={setEditorRef}
                  image={picture.img}
                  style={{ width: "100%", height: "100%" }}
                  border={50}
                  color={[0, 0, 0, 0.8]} // RGBA
                  rotate={0}
                  scale={picture.zoom / 10}
                  borderRadius={150}
                  className="avatar"
                  // style={{ borderRadius: "50%", marginLeft: "50%" }}
                />
                <Slider
                  aria-label="raceSlider"
                  value={picture.zoom}
                  min={10}
                  max={50}
                  step={0.1}
                  onChange={handleSlider}
                ></Slider>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={handleCancel}
                  >
                    Annuler
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    Sauvegarder
                  </Button>
                </Box>
              </Box>
            </Modal>
          ) : (
            <section>
              <div className={styles.info}>
                {!isEmpty(firstPhoto) ? (
                  <div className={styles.suppr}>
                    <label onClick={removeCurrentFile}>
                      Supprimer la photo actuelle
                    </label>
                  </div>
                ) : (
                  <div className={`${styles.suppr}  ${styles.dis}`}>
                    <label>Supprimer la photo actuelle</label>
                  </div>
                )}
                <div className={styles.photo}>
                  <div>
                    <Image
                      src={
                        !isEmpty(srcImg)
                          ? !isEmpty(ancImg.obj)
                            ? ancImg.obj
                            : srcImg
                          : "/default_avatar.jpg"
                      }
                      alt=""
                      fill
                      className={styles.photoImg}
                    />
                  </div>
                </div>
                {isLoadingPhotos ? (
                  <div className={styles.not}>
                    <label></label>
                  </div>
                ) : initialPhotos?.length === 0 ? (
                  <div className={styles.not}>
                    <label>
                      Vous n{"'"}avez aucune photo enregistré pour le moment
                    </label>
                  </div>
                ) : initialPhotos?.length === 1 ? (
                  <div className={styles.not}>
                    <label>
                      Vous n{"'"}avez qu{"'"}une seule photo enregistré pour le
                      moment
                    </label>
                  </div>
                ) : (
                  <div className={styles.choose}>
                    {sbc ? (
                      <label className={styles.dis}>
                        ou sélectionner une ancienne photo de profil
                      </label>
                    ) : (
                      <label onClick={handleSelection}>
                        ou sélectionner une ancienne photo de profil
                      </label>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.hr} />
              <div className={styles.bio}>
                <label htmlFor="bio">Courte biographie</label>
                <div>
                  <textarea
                    className={`${styles.textarea} scr`}
                    onChange={(e) =>
                      setNewBio((prev) => ({ ...prev, obj: e.target.value }))
                    }
                    value={newBio.obj}
                  />
                </div>
              </div>
            </section>
          )}
        </section>
        {activeCh && (
          <div className={styles.chi}>
            <div ref={ref}>
              <div className={styles.top}>
                <div className={styles.logo}>
                  <Image
                    src={"/logo.png"}
                    fill
                    alt=""
                    className={styles.logoImg}
                  />
                </div>
                <i
                  onClick={() => {
                    setAncImg({ obj: null, value: false });
                    setActiveCh(false);
                  }}
                  className={styles.close}
                >
                  <CgClose size={"1.5rem"} />
                </i>
              </div>
              <div className={styles.line} />

              <div className={`${styles.contenu} scr`}>
                <div className={styles.ins}>
                  <span>Cliquer sur la photo que vous voulez choisir.</span>
                </div>
                <div className={styles.contPhoto}>
                  {initialPhotos?.map((img, i) => {
                    return (
                      <div
                        key={i}
                        className={
                          i === imgIndex
                            ? `${styles.pht} ${styles.activeImg}`
                            : `${styles.pht}`
                        }
                        onClick={() => {
                          setAncImg({ obj: img, value: true });
                          setImgIndex(i);
                        }}
                      >
                        <Image src={img} className={styles.ph} fill alt="" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.line} />
              <div className={styles.bottom}>
                <div
                  className={
                    !ancImg.value
                      ? `${styles.contBtn} ${styles.dsb}`
                      : `${styles.contBtn}`
                  }
                >
                  <div className={styles.reset}>
                    <button
                      onClick={() => {
                        setAncImg({ obj: null, value: false });
                        setActiveCh(false);
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                  <div className={styles.submit}>
                    <button onClick={() => handleChImg(ancImg.obj)}>
                      Choisir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
