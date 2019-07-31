import React from 'react';

export default function Post() {
  return (
    <div id="post">
      <section>
        <h1>Post</h1>
      </section>
      <style
        dangerouslySetInnerHTML={{
          __html: '#react-content { height: 100%; background-color: #fff }',
        }}
      />
    </div>
  );
}
