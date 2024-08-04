/** @format */

"use client";
import Container from "@/components/Container";
import { useEffect, useContext, useRef } from "react";
import { io } from "socket.io-client";
import { UidContext } from "@/context/UidContext";
import { useDispatch } from "react-redux";
import { updateIO } from "@/redux/slices/socketIoSlice";
import { socket } from "@/socket";

export default function HomeLayout({ children }) {
  const { userId } = useContext(UidContext);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("join", userId);
    dispatch(updateIO({ io: socket }));
  }, [userId]);
  return <Container>{children}</Container>;
}
