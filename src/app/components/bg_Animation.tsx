'use client'

import React, { useEffect, RefObject } from 'react';
import * as THREE from 'three';

interface Props {
  containerRef: RefObject<HTMLDivElement>;
}

const StarfieldAnimation: React.FC<Props> = ({ containerRef }) => {
    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        
        // Set the position of the renderer's canvas to absolute and cover the entire container
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.zIndex = '-1'; // Ensure it's behind other content
        
        containerRef.current.appendChild(renderer.domElement);

        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1,
            transparent: true
        });

        const starVertices = [];
        for (let i = 0; i < 15000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        camera.position.z = 1;

        let time = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.0005;
            
            // Circular camera movement
            camera.position.x = Math.sin(time) * 0.5;
            camera.position.y = Math.cos(time) * 0.5;
            camera.lookAt(scene.position);

            // Add slight drag effect to stars
            stars.rotation.y += 0.0001;
            
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, [containerRef]);

    return null;
};

export default StarfieldAnimation;