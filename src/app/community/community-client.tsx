
"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { summarizeEcoProjectIdeas } from "@/ai/flows/summarize-eco-project-ideas";
import type { CommunityPost } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardDescription } from "@/components/ui/card";

const vertexShader = `
uniform vec2 uHoverUv;
uniform float uHoverState;
varying vec2 vUv;
varying float vOffset;

const float PI = 3.14159265359;

float gaussian(float mu, float sigma) {
  return (1.0 / (sigma * sqrt(2.0 * PI))) * exp(-0.5 * (pow(mu, 2.0) / pow(sigma, 2.0)));
}

void main() {
  vUv = uv;
  vec3 pos = position;
  float aspect = 1.0; 
  vec2 uv1 = uv;
  vec2 uv2 = uHoverUv;
  uv1.x *= aspect;
  uv2.x *= aspect;

  float d = distance(uv1, uv2);
  float offset = gaussian(d * 3.0, 0.6);
  pos *= (1.0 + offset * 0.6 * uHoverState);
  vOffset = offset;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform sampler2D uTexture;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  gl_FragColor = color;
}
`;

function PostCard({ post }: { post: CommunityPost }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const image = imageRef.current;
    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(image.src, () => {
      renderer.setSize(image.clientWidth, image.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    });

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uHoverUv: { value: new THREE.Vector2(0.5, 0.5) },
        uHoverState: { value: 0.0 },
      },
      transparent: true,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      material.uniforms.uHoverUv.value.set(x, y);
    };

    const onMouseEnter = () => {
        material.uniforms.uHoverState.value = 1.0;
    };

    const onMouseLeave = () => {
        material.uniforms.uHoverState.value = 0.0;
    };
    
    const currentCanvas = canvasRef.current;
    currentCanvas.addEventListener('mousemove', onMouseMove);
    currentCanvas.addEventListener('mouseenter', onMouseEnter);
    currentCanvas.addEventListener('mouseleave', onMouseLeave);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if(imageRef.current) {
            renderer.setSize(imageRef.current.clientWidth, imageRef.current.clientHeight);
        }
    }
    window.addEventListener('resize', handleResize);

    return () => {
      currentCanvas.removeEventListener('mousemove', onMouseMove);
      currentCanvas.removeEventListener('mouseenter', onMouseEnter);
      currentCanvas.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };

  }, [post.authorAvatarUrl]);


  const handleSummarize = async () => {
    setLoading(true);
    try {
      const result = await summarizeEcoProjectIdeas({ projectIdeaText: post.content });
      setSummary(result.summary);
    } catch (error) {
      console.error("Failed to summarize:", error);
      setSummary("Sorry, we couldn't generate a summary at this time.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <div className="eco-card">
      <div className="eco-card-title !text-xl !normal-case flex items-center gap-4">
        <Avatar>
            <AvatarImage src={post.authorAvatarUrl} alt={post.author} />
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          {post.title}
          <CardDescription className="!text-sm">
            by {post.author} &bull; {post.timestamp}
          </CardDescription>
        </div>
      </div>
      <div className="eco-card-content grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <p className="text-foreground/90">{post.content}</p>
          <div className="flex items-center gap-4 mt-4">
            <Button variant="outline" size="sm" onClick={handleLike}>
              <Icons.thumbsUp className="mr-2 h-4 w-4" />
              Upvote ({likes})
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleSummarize}>
                  <Icons.lightbulb className="mr-2 h-4 w-4" />
                  Summarize with AI
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Summary of "{post.title}"</DialogTitle>
                  <DialogDescription>
                    Here is a quick summary generated by our AI.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {loading && <Skeleton className="h-20 w-full" />}
                  {!loading && <p>{summary}</p>}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
             <img ref={imageRef} src={post.imageUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-0" />
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  );
}

export function CommunityClient({ posts }: { posts: CommunityPost[] }) {
    const topPosts = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3);
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <div className="eco-card">
          <div className="eco-card-title !text-xl !normal-case">Share a New Idea</div>
           <div className="eco-card-icon">
                <Icons.lightbulb className="bg-gradient-to-r from-yellow-400 to-orange-500" />
            </div>
          <div className="eco-card-content space-y-4">
             <CardDescription>What's on your mind?</CardDescription>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g., School Recycling Program" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Your Idea</Label>
              <Textarea
                id="content"
                placeholder="Describe your idea in detail..."
                rows={5}
              />
            </div>
             <Button className="w-full">Post Idea</Button>
          </div>
        </div>

        <div className="eco-card">
            <div className="eco-card-title !text-xl !normal-case">Community Highlights</div>
            <div className="eco-card-icon">
                <Icons.star className="bg-gradient-to-r from-yellow-400 to-orange-500" />
            </div>
            <div className="eco-card-content space-y-4">
                <CardDescription>This week's top 3 ideas!</CardDescription>
                <ul className="space-y-3">
                    {topPosts.map(post => (
                        <li key={post.id} className="flex items-center gap-4 p-2 rounded-md bg-background/50">
                            <Icons.trophy className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{post.title}</p>
                                <p className="text-xs text-muted-foreground">by {post.author} &bull; {post.likes} upvotes</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

      </div>
      <div className="lg:col-span-2 space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
