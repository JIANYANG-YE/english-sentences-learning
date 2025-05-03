import React from 'react';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '英语学习平台 - 提高英语水平的最佳选择';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#4338CA',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            height: '150px',
            backgroundImage: 'linear-gradient(to bottom right, #6366F1, #4338CA)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
          }}
        >
          <svg
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '0',
            marginBottom: '20px',
          }}
        >
          英语学习平台
        </h1>
        <p
          style={{
            fontSize: '32px',
            textAlign: 'center',
            margin: '0',
            marginBottom: '40px',
            maxWidth: '800px',
          }}
        >
          提高英语水平的最佳选择
        </p>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              padding: '15px 30px',
              backgroundColor: 'white',
              color: '#4338CA',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '24px',
            }}
          >
            立即开始学习
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 