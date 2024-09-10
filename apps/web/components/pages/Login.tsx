"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { OrbitControls, useGLTF, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Render the 3D model of the starship
function ModelStarShip3D() {
  const gltf = useGLTF("/starship/scene.gltf");
  console.log(gltf);
  return <primitive object={gltf.scene} scale={[0.5, 0.5, 0.5]} />;
}

export const Login = () => {
  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-[#00001a] to-[#000033]">
      <Canvas style={{ position: "absolute" }}>
        <ModelStarShip3D />
        <OrbitControls enableZoom={false} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Stars />
      </Canvas>
      <motion.div
        className="bg-black bg-opacity-30 backdrop-blur-lg rounded-3xl p-12 text-center text-white z-10 border border-opacity-20 border-white shadow-2xl select-none"
        initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
      >
        <motion.img
          src="/mode-mobile-logo.png"
          alt="Mode Mobile Logo"
          className="w-auto h-14 mx-auto mb-8"
          initial={{ y: -50, opacity: 0, rotate: -180 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 1, type: "spring" }}
        />
        <motion.div
          className="space-y-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl font-bold select-none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 "
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            Welcome to Web3 To-Do
          </motion.h1>
          <motion.p
            className="text-lg text-blue-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ color: "#8B5CF6", scale: 1.05 }}
          >
            Powered by Mode Mobile
          </motion.p>
        </motion.div>
        <motion.p
          className="mt-6 mb-8 select-none text-xl text-gray-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Revolutionize your productivity with blockchain-powered task
          management
        </motion.p>

        <motion.button
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border-none py-4 px-10 text-white text-xl font-semibold rounded-full cursor-pointer mt-5 select-none shadow-lg overflow-hidden relative"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(138, 43, 226, 0.8)",
            transition: { duration: 0.3 },
          }}
          whileTap={{
            scale: 0.95,
            boxShadow: "0 0 5px rgba(138, 43, 226, 0.5)",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 1,
            duration: 0.7,
          }}
          onClick={openConnectModal}
        >
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
          >
            Connect Wallet to Start
          </motion.span>
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 1], opacity: [1, 1, 0] }}
            transition={{ duration: 0.5, times: [0, 0.3, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0"
            whileHover={{ opacity: 0.3, rotate: 360 }}
            transition={{ duration: 0.7 }}
          />
        </motion.button>
        <motion.p
          className="mt-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          Earn NFTs by completing tasks and boost your productivity!
        </motion.p>
      </motion.div>
    </div>
  );
};
