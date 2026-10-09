const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

async function run() {
    const blogsDir = path.join(__dirname, '..');
    const postsJsonPath = path.join(blogsDir, 'posts.json');
    const templatePath = path.join(blogsDir, 'post.html');

    if (!fs.existsSync(postsJsonPath)) {
        console.error('posts.json not found');
        process.exit(1);
    }
    
    if (!fs.existsSync(templatePath)) {
        console.error('post.html template not found');
        process.exit(1);
    }

    const allPostsData = JSON.parse(fs.readFileSync(postsJsonPath, 'utf-8'));
    let templateHtml = fs.readFileSync(templatePath, 'utf-8');

    let generated = 0;
    let skipped = 0;

    for (const postMeta of allPostsData) {
        const mdPath = path.join(blogsDir, 'posts', postMeta.slug + '.md');
        if (!fs.existsSync(mdPath)) {
            console.log(`Skipped (Missing markdown): ${postMeta.slug}`);
            skipped++;
            continue;
        }

        try {
            const markdownText = fs.readFileSync(mdPath, 'utf-8');
            const htmlContent = marked.parse(markdownText);
            
            let postHtml = templateHtml;

            // Update title
            postHtml = postHtml.replace(/<title>.*?<\/title>/s, `<title>${postMeta.title} — VYOMARC</title>`);
            
            // Update meta description
            postHtml = postHtml.replace(
                /<meta name="description" content=".*?">/s,
                `<meta name="description" content="${postMeta.excerpt}">`
            );

            // Update OG tags
            postHtml = postHtml.replace(/<meta property="og:title" content=".*?">/s, `<meta property="og:title" content="${postMeta.title}">`);
            postHtml = postHtml.replace(/<meta property="og:description" content=".*?">/s, `<meta property="og:description" content="${postMeta.excerpt}">`);
            postHtml = postHtml.replace(/<meta property="og:url" content=".*?">/s, `<meta property="og:url" content="https://vyomarctech.com/blogs/posts/${postMeta.slug}.html">`);
            if (postMeta.thumbnail) {
                const fullThumb = new URL(postMeta.thumbnail, 'https://vyomarctech.com/blogs/').href;
                postHtml = postHtml.replace(/<meta property="og:image" content=".*?">/s, `<meta property="og:image" content="${fullThumb}">`);
                postHtml = postHtml.replace(/<meta name="twitter:image" content=".*?">/s, `<meta name="twitter:image" content="${fullThumb}">`);
            }

            // Update Twitter tags
            postHtml = postHtml.replace(/<meta name="twitter:title" content=".*?">/s, `<meta name="twitter:title" content="${postMeta.title}">`);
            postHtml = postHtml.replace(/<meta name="twitter:description" content=".*?">/s, `<meta name="twitter:description" content="${postMeta.excerpt}">`);

            // Canonical URL
            postHtml = postHtml.replace(
                /<link rel="canonical" href=".*?">/s,
                `<link rel="canonical" href="https://vyomarctech.com/blogs/posts/${postMeta.slug}.html">`
            );

            // JSON-LD
            const structuredData = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": postMeta.title,
                "description": postMeta.excerpt,
                "image": postMeta.thumbnail ? new URL(postMeta.thumbnail, 'https://vyomarctech.com/blogs/').href : "https://vyomarctech.com/images/default-og.jpg",
                "author": {
                    "@type": "Person",
                    "name": postMeta.author || "VYOMARC"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "VYOMARC Technologies",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://vyomarctech.com/images/logo.png"
                    }
                },
                "datePublished": postMeta.date,
                "dateModified": postMeta.date, // Default to publish date
                "about": [postMeta.category || "Technology", "Local Business", "Software Engineering"],
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `https://vyomarctech.com/blogs/posts/${postMeta.slug}.html`
                }
            };

            const breadcrumbData = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://vyomarctech.com/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Blog",
                        "item": "https://vyomarctech.com/blogs/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": postMeta.title,
                        "item": `https://vyomarctech.com/blogs/posts/${postMeta.slug}.html`
                    }
                ]
            };
            postHtml = postHtml.replace(
                /<script type="application\/ld\+json">.*?<\/script>/s,
                `<script type="application/ld+json">\n${JSON.stringify([structuredData, breadcrumbData], null, 2)}\n</script>`
            );

            // Add data-prerendered-slug to body
            postHtml = postHtml.replace(/<body>/, `<body data-prerendered-slug="${postMeta.slug}">`);

            // Generate Post Container HTML
            const isAbsolute = postMeta.thumbnail && (postMeta.thumbnail.startsWith('http://') || postMeta.thumbnail.startsWith('https://'));
            const thumbSrc = isAbsolute ? postMeta.thumbnail : (postMeta.thumbnail ? '../' + postMeta.thumbnail : '');
            const thumbnailHTML = thumbSrc
                ? `<img src="${thumbSrc}" alt="${postMeta.title}" class="post-hero-image" onerror="this.style.display='none'">`
                : '';
                
            let viewsText = ''; // Views will be dynamically updated by client script if available

            let containerHtml =
                thumbnailHTML +
                '<div class="post-meta">' +
                (postMeta.category ? `<a href="../index.html?cat=${encodeURIComponent(postMeta.category)}" class="category-tag">${postMeta.category}</a><br>` : '') +
                '<span>' + formatDate(postMeta.date) + '</span>' +
                '<span class="separator">·</span>' +
                '<span>By ' + (postMeta.author || 'VYOMARC') + '</span>' +
                viewsText +
                '</div>' +
                '<h1 class="post-page-title">' + postMeta.title + '</h1>' +
                '<div class="post-content">' + htmlContent + '</div>' +
                '<div class="share-bar">' +
                '<span class="share-label">Share this article:</span>' +
                '<div class="share-buttons">' +
                '<button class="share-btn share-wa" aria-label="Share on WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg></button>' +
                '<button class="share-btn share-reddit" aria-label="Share on Reddit" title="Reddit"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-6.07-1.72.08-1.1.4-3.05 1.52-3.7.72-.4 1.73-.24 3 .5C17.2 6.3 18.46 7.5 20 7.5c1.65 0 3-1.35 3-3s-1.35-3-3-3c-1.38 0-2.54.94-2.88 2.22-1.43-.72-2.64-.8-3.6-.25-1.64.94-1.95 3.47-2 4.55-2.33.08-4.45.7-6.1 1.72C4.86 8.98 3.96 8.5 3 8.5c-1.65 0-3 1.35-3 3 0 1.32.84 2.44 2.05 2.84-.03.22-.05.44-.05.66 0 3.86 4.5 7 10 7s10-3.14 10-7c0-.22-.02-.44-.05-.66 1.2-.4 2.05-1.54 2.05-2.84zM2.3 11.5c0-.94.76-1.7 1.7-1.7.6 0 1.16.32 1.46.82C3.86 11.36 2.65 12.56 2.06 14.1c-.5-.5-.86-1.12-.86-1.8zm18 7c-2.3 2.1-6.15 2.1-8.3 2.1-2.15 0-6-.02-8.3-2.1-1.32-1.28-1.7-2.9-1.7-3.9 0-1.64 1.34-3.16 3.8-3.8.3-.08.5-.4.4-.7-.04-.17-.06-.34-.06-.5 0-2.43 3.03-4.4 6.8-4.4 3.76 0 6.8 1.97 6.8 4.4 0 .16-.02.33-.06.5-.02.3.18.62.48.7 2.46.64 3.8 2.16 3.8 3.8 0 1-3.9 2.62-5.22 3.9zm3.64-4.4c-.6-1.54-1.8-2.74-3.4-3.48.3-.5.86-.82 1.46-.82.94 0 1.7.76 1.7 1.7 0 .68-.36 1.3-.86 1.8z"/><path d="M16 14.7c-1.4 1.4-4 1.4-4 1.4s-2.6 0-4-1.4c-.26-.26-.7-.26-.96 0-.27.27-.27.7 0 .97 1.7 1.7 4.96 1.7 4.96 1.7s3.25 0 4.95-1.7c.26-.26.26-.7 0-.96-.25-.26-.7-.26-.95 0zM8.38 10.32c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM15.62 10.32c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></button>' +
                '<button class="share-btn share-in" aria-label="Share on LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></button>' +
                '<button class="share-btn share-copy" aria-label="Copy URL" title="Copy URL"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg><span class="copy-text">Copy</span></button>' +
                '</div>' +
                '<div class="share-toast" aria-live="polite"></div>' +
                '</div>';

            // Related Posts
            const currentCategory = postMeta.category || '';
            let availablePosts = allPostsData
                .filter(p => p.slug !== postMeta.slug)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            let sameCategory = availablePosts.filter(p => p.category === currentCategory);
            let differentCategory = availablePosts.filter(p => p.category !== currentCategory);
            let relatedPosts = sameCategory.slice(0, 2);
            if (differentCategory.length > 0) relatedPosts.push(differentCategory[0]);
            if (relatedPosts.length < 3) {
                const alreadyIncluded = relatedPosts.map(p => p.slug);
                const remaining = availablePosts.filter(p => !alreadyIncluded.includes(p.slug));
                relatedPosts = relatedPosts.concat(remaining.slice(0, 3 - relatedPosts.length));
            }

            if (relatedPosts.length > 0) {
                let relatedHTML = '<div class="related-posts-section"><h2 class="related-posts-title">Related Posts</h2><div class="related-posts-grid">';
                relatedPosts.forEach(post => {
                    const isRelAbsolute = post.thumbnail && (post.thumbnail.startsWith('http://') || post.thumbnail.startsWith('https://'));
                    const relThumbSrc = isRelAbsolute ? post.thumbnail : (post.thumbnail ? '../' + post.thumbnail : '');
                    const thumb = relThumbSrc 
                        ? `<img src="${relThumbSrc}" alt="${post.title}" class="related-card-img" onerror="this.style.display='none'">`
                        : `<div class="related-card-fallback"><svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>`;
                    const catTag = post.category ? `<span class="related-card-cat">${post.category}</span>` : '';
                    
                    // Link to clean url!
                    relatedHTML += `<a href="${post.slug}.html" class="related-card">` +
                        `<div class="related-card-img-wrapper">${thumb}${catTag}</div>` +
                        `<div class="related-card-content"><h3 class="related-card-title">${post.title}</h3></div>` +
                        `</a>`;
                });
                relatedHTML += '</div></div>';
                containerHtml += relatedHTML;
            }

            // Replace post container
            postHtml = postHtml.replace(
                /<div id="post-container">.*?<\/div>\s*<\/main>/s,
                `<div id="post-container">${containerHtml}</div>\n    </main>`
            );
            
            // Adjust paths in template (so they resolve properly from /blogs/posts/)
            postHtml = postHtml.replace(/href="style\.css"/g, 'href="../style.css"');
            postHtml = postHtml.replace(/src="post-script\.js"/g, 'src="../post-script.js"');
            postHtml = postHtml.replace(/src="script\.js"/g, 'src="../script.js"');
            postHtml = postHtml.replace(/href="\/blogs\/"/g, 'href="/blogs/"');
            // Back to articles link
            postHtml = postHtml.replace(/href="index\.html"/g, 'href="../index.html"');

            const outPath = path.join(blogsDir, 'posts', postMeta.slug + '.html');
            fs.writeFileSync(outPath, postHtml, 'utf-8');
            generated++;

        } catch (error) {
            console.error(`Failed to render ${postMeta.slug}:`, error);
        }
    }

    console.log(`Pre-rendering complete. Generated: ${generated}, Skipped: ${skipped}`);

    // Sitemap auto-generation
    const sitemapPath = path.join(blogsDir, '..', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
        let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
        
        const urlsetEnd = sitemapContent.indexOf('</urlset>');
        if (urlsetEnd !== -1) {
            let coreSitemap = sitemapContent.substring(0, urlsetEnd);
            
            // Remove existing blog post URLs
            coreSitemap = coreSitemap.replace(/<url>\s*<loc>https:\/\/vyomarctech\.com\/blogs\/posts\/.*?<\/loc>.*?<\/url>\s*/gs, '');
            
            let newSitemap = coreSitemap.trim() + '\n';
            
            for (const postMeta of allPostsData) {
                newSitemap += `  <url>\n    <loc>https://vyomarctech.com/blogs/posts/${postMeta.slug}.html</loc>\n    <lastmod>${postMeta.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
            }
            newSitemap += '</urlset>\n';
            
            fs.writeFileSync(sitemapPath, newSitemap, 'utf-8');
            console.log('Sitemap auto-updated.');
        }
    }
}

run();
