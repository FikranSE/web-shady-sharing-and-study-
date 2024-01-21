-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table webppsi.categori
CREATE TABLE IF NOT EXISTS `categori` (
  `id_categori` int NOT NULL AUTO_INCREMENT,
  `categori` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_categori`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table webppsi.categori: ~2 rows (approximately)
INSERT INTO `categori` (`id_categori`, `categori`) VALUES
	(1, 'Moduls'),
	(2, 'Projects');

-- Dumping structure for table webppsi.kuisioner
CREATE TABLE IF NOT EXISTS `kuisioner` (
  `id_kuisioner` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `id_matkul` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `excerpt` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_kuisioner`),
  KEY `FK_kuisioner_users` (`id_user`),
  KEY `FK_kuisioner_matkul` (`id_matkul`),
  CONSTRAINT `FK_kuisioner_matkul` FOREIGN KEY (`id_matkul`) REFERENCES `matkul` (`id_matkul`),
  CONSTRAINT `FK_kuisioner_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table webppsi.kuisioner: ~2 rows (approximately)
INSERT INTO `kuisioner` (`id_kuisioner`, `id_user`, `id_matkul`, `title`, `excerpt`, `description`, `created_at`, `updated_at`) VALUES
	(1, 1, 11, 'Kuisioner ppsi terkait tugas besar Tahun2023', 'Silahkan isi kuisioner ini supaya kita bisa melihat berapa', '<div><em>If you\'re not attracting people visually, how will you get them to take the next steps to actually read (and, hopefully, </em><a href="https://blog.hubspot.com/blog/tabid/6307/bid/33700/How-to-Convert-Casual-Blog-Visitors-Into-Dedicated-Subscribers.aspx?hubs_content=blog.hubspot.com/blog/tabid/6307/bid/34143/12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=subscribe%20to"><em>subscribe to</em></a><em>) your content? Once you\'re done creating quality content, you still have the challenge of presenting it in a way that clearly dictates what your blog is about.</em></div><div><br>Images, text, and links need to be shown off just right — otherwise, readers might abandon your content, if it\'s not showcased in a way that\'s appealing, easy to follow, and generates more interest.</div><div><br>That\'s why we\'ve compiled some examples of blog homepages to <a href="https://offers.hubspot.com/editorial-calendar-templates?hubs_signup-url=blog.hubspot.com/blog/tabid/6307/bid/34143/12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_signup-cta=get%20you%20on%20the%20right%20track&amp;hubs_post=blog.hubspot.com/blog/tabid/6307/bid/34143/12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_post-cta=get%20you%20on%20the%20right%20track">get you on the right track</a> to designing the perfect blog for your readers. Check \'em out, below. <br><br>LINK : <br><a href="https://www.pando.com/">https://www.pando.com/</a></div>', '2023-10-18 16:50:28', '2023-10-18 16:50:28'),
	(2, 5, 6, 'The Ultimate Guide to Embedding Content on', 'Embedding social media content into your blog or website can significantly impact sales', '<div>&nbsp;Embedding social media content into your blog or website can significantly impact sales, audience trust, and the authenticity of your marketing initiatives. This is especially true if you’re embedding user-generated content:<br><br></div><div><figure data-trix-attachment="{&quot;contentType&quot;:&quot;image&quot;,&quot;height&quot;:400,&quot;url&quot;:&quot;https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/embed-social-media-posts.jpg?width=595&amp;height=400&amp;name=embed-social-media-posts.jpg&quot;,&quot;width&quot;:595}" data-trix-content-type="image" class="attachment attachment--preview"><img src="https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/embed-social-media-posts.jpg?width=595&amp;height=400&amp;name=embed-social-media-posts.jpg" width="595" height="400"><figcaption class="attachment__caption"></figcaption></figure></div><ul><li>Consumers rank authentic, user-generated content as <a href="https://www.tintup.com/state-of-social-user-generated-content/?hubs_content=blog.hubspot.com%25252Fblog%25252Ftabid%25252F6307%25252Fbid%25252F34143%25252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium"><strong>the most trustworthy</strong></a> form of content.</li><li><a href="https://www.globenewswire.com/news-release/2022/07/06/2475085/0/en/New-Survey-from-EnTribe-Emphasizes-Value-of-User-Generated-Content-in-Marketing-Initiatives.html?hubs_content=blog.hubspot.com%25252Fblog%25252Ftabid%25252F6307%25252Fbid%25252F34143%25252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium"><strong>77%</strong></a> of consumers would be more inclined to purchase a product or service if they incorporated user-generated content into marketing initiatives.</li><li>Seeing photos and videos from other consumers before making a purchase reduces the likelihood of a return for <a href="https://www.powerreviews.com/research/reduce-returns/?hubs_content=blog.hubspot.com%25252Fblog%25252Ftabid%25252F6307%25252Fbid%25252F34143%25252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium"><strong>69% of shoppers</strong></a>.</li></ul><div><br>Despite the benefits, figuring out how to embed this content can be tricky. This post is a step-by-step guide to embedding social media content into your website from Twitter, Facebook, Instagram, Pinterest, Google Calendar, YouTube, and TikTok.<br><br></div><div><br><br></div><div><a href="https://blog.hubspot.com/cs/c/?cta_guid=ddc9d02d-8665-4844-9d57-400a8bed342b&amp;signature=AAH58kG162tRa3UXq2fcNi2HhoaZI1ubcg&amp;pageId=1036518655&amp;placement_guid=9867c419-adc7-417c-b4cc-200c33639c28&amp;click=f1e9f86b-c961-40d1-97df-60a27dc0d0f3&amp;hsutk=&amp;canon=https%3A%2F%2Fblog.hubspot.com%2Fmarketing%2Fembed-social-media-posts-guide&amp;portal_id=53&amp;redirect_url=APefjpGTls8iDOA_uGEHAghB-JfAEtTmDTpFllFIogb5TmV7BffyH1Y5UmfUtjHC8ZQjo7FC_zf5Ejbh9OC2C9Zwq4lVZimaIZRHFoHfoi_2HItHH9_B4Uqm0eTJI4dtpzXgUp_BzUZxSPNNf9RvKrVyZDpjJJVV05puLEzPhrrY9OhbEw0y438&amp;hubs_content=blog.hubspot.com%25252Fblog%25252Ftabid%25252F6307%25252Fbid%25252F34143%25252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium&amp;hubs_signup-url=blog.hubspot.com/marketing/embed-social-media-posts-guide&amp;hubs_signup-cta=cta_button&amp;hubs_post=blog.hubspot.com/marketing/embed-social-media-posts-guide"><br>→ Free Download: 5 Key Steps to Building and Maintaining a High Performing Website<br></a><br></div><div><strong><br>Table of Contents<br></strong><br></div><ul><li><a href="https://blog.hubspot.com/marketing/embed-social-media-posts-guide?hubs_content=blog.hubspot.com%252Fblog%252Ftabid%252F6307%252Fbid%252F34143%252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium#Tweets"><strong>How to Embed a Tweet</strong></a></li><li><a href="https://blog.hubspot.com/marketing/embed-social-media-posts-guide?hubs_content=blog.hubspot.com%252Fblog%252Ftabid%252F6307%252Fbid%252F34143%252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium#Facebookposts"><strong>Embed Facebook Post or Video</strong></a></li><li><a href="https://blog.hubspot.com/marketing/embed-social-media-posts-guide?hubs_content=blog.hubspot.com%252Fblog%252Ftabid%252F6307%252Fbid%252F34143%252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium#Facebookfeed"><strong>Embed Facebook Feed</strong></a></li><li><a href="https://blog.hubspot.com/marketing/embed-social-media-posts-guide?hubs_content=blog.hubspot.com%252Fblog%252Ftabid%252F6307%252Fbid%252F34143%252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium#Instagram"><strong>Embed Instagram Feed and Posts</strong></a></li><li><a href="https://blog.hubspot.com/marketing/embed-social-media-posts-guide?hubs_content=blog.hubspot.com%252Fblog%252Ftabid%252F6307%252Fbid%252F34143%252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium#Pinterest%20Pins"><strong>Embed Pinterest Pins</strong></a></li><li><a href="https://blog.hubspot.com/marketing/embed-social-media-posts-guide?hubs_content=blog.hubspot.com%252Fblog%252Ftabid%252F6307%252Fbid%252F34143%252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium#Pinterest%20Boards"><strong>Embed Pinterest Boards</strong></a></li><li><a href="https://blog.hubspot.com/marketing/embed-social-media-posts-guide?hubs_content=blog.hubspot.com%252Fblog%252Ftabid%252F6307%252Fbid%252F34143%252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium#Google%20Calendar"><strong>How to Embed Google Calendar</strong></a></li><li><a href="https://blog.hubspot.com/marketing/embed-social-media-posts-guide?hubs_content=blog.hubspot.com%252Fblog%252Ftabid%252F6307%252Fbid%252F34143%252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium#YouTube%20Videos"><strong>How to Embed a YouTube Video</strong></a></li><li><a href="https://blog.hubspot.com/marketing/embed-social-media-posts-guide?hubs_content=blog.hubspot.com%252Fblog%252Ftabid%252F6307%252Fbid%252F34143%252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium#embed-tiktok-video"><strong>How to Embed a TikTok Video</strong></a></li></ul><div><br>How to Embed a Tweet<br><br></div><ol><li>Find the tweet you\'d like to embed.</li><li>Click the three dots on the top-right of the Tweet.</li><li>Choose Embed Tweet, which brings you to the Twitter Publish page.</li><li>Click Copy Code or make customizations.</li><li>Paste the embed code into your website\'s HTML editor.</li><li>Optional: Center align the Tweet.</li></ol><div><br>1. Find the tweet you\'d like to embed.<br><br></div><div><br>The first step to embedding a Tweet is finding the one you want to display in its natural habitat — Twitter. You can only get embed codes from its website.<br><br></div><div><br>2. Click the three dots at the top-right of the tweet.<br><br></div><div><br>3. Click <em>Embed Tweet</em>.<br><br></div><div><br>Clicking this arrow icon will reveal a dropdown menu of options, including one called "Embed Tweet." Click this option.<br><br></div><div><br>4. Click <em>Copy Code</em> or make customizations.<br><br></div><div><br>You can customize the theme (light or dark), set a language, and hide Tweet replies. If you make customizations, click <em>Update</em>, then <em>Copy Code</em>.<br><br></div><div><br>5. Paste the code into your website\'s HTML editor.<br><br></div><div><br>Paste the code into your HTML editor by opening the source code (some content management systems have a "" icon where you can access this source code) and pasting it where you want it to appear.<br><br></div><div><br>5. Optional: Add \'tw-align-center\' after the words "twitter-tweet" in the embed code.<br><br></div><div><br>Once you pasted this code into your HTML, however, you\'ll want to center-align this tweet so it doesn\'t automatically appear pushed up against the left or right side of your webpage. To correct this, add the text, \'tw-align-center\' (without quotation marks) directly after "twitter-tweet" in the embed code. <a href="https://blog.hubspot.com/blog/tabid/6307/bid/34273/How-to-Center-Align-Your-Embedded-Tweets-Quick-Tip.aspx?hubs_content=blog.hubspot.com%25252Fblog%25252Ftabid%25252F6307%25252Fbid%25252F34143%25252F12-inspiring-examples-of-beautiful-blog-homepage-designs.aspx&amp;hubs_content-cta=-medium">You can learn more about this method here</a>.&nbsp;<br><br></div>', '2023-10-20 08:13:07', '2023-10-20 08:13:07'),
	(3, 1, 9, 'Perlu ga?', 'And I am not that special for saying that. Most of us want to leave an imprint on the world that', '<div>coba lagi!</div>', '2023-11-22 02:43:16', '2023-11-22 02:43:16');

-- Dumping structure for table webppsi.matkul
CREATE TABLE IF NOT EXISTS `matkul` (
  `id_matkul` int NOT NULL,
  `matkul` varchar(50) DEFAULT NULL,
  `Created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_matkul`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table webppsi.matkul: ~8 rows (approximately)
INSERT INTO `matkul` (`id_matkul`, `matkul`, `Created_at`, `Updated_at`) VALUES
	(1, 'ERP', '2023-11-17 04:42:12', '2023-11-17 04:42:12'),
	(2, 'Dasar - Dasar Pemrograman', '2023-11-17 04:42:36', '2023-11-17 04:42:36'),
	(3, 'PBO', '2023-11-17 04:42:50', '2023-11-17 04:42:50'),
	(4, 'SDA', '2023-11-17 04:43:04', '2023-11-17 04:43:04'),
	(5, 'Database', '2023-11-17 04:43:13', '2023-11-17 04:43:13'),
	(6, 'E-Bisnis', '2023-11-17 04:43:23', '2023-11-17 04:43:23'),
	(7, 'PBD', '2023-11-17 04:43:31', '2023-11-17 04:43:31'),
	(8, 'Probis', '2023-11-17 04:43:42', '2023-11-17 04:43:42'),
	(9, 'PTB', '2023-11-17 04:44:31', '2023-11-17 04:44:31'),
	(10, 'GIS', '2023-11-17 04:44:53', '2023-11-17 04:44:53'),
	(11, 'PPSI', '2023-11-22 01:19:47', '2023-11-22 01:20:29'),
	(12, 'MPSI', '2023-11-22 01:20:12', '2023-11-22 01:20:32');

-- Dumping structure for table webppsi.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `id_post` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `id_categori` int DEFAULT NULL,
  `id_matkul` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `excerpt` varchar(255) DEFAULT NULL,
  `description` text,
  `uploaded_file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_post`),
  KEY `FK_posts_users` (`id_user`),
  KEY `FK_posts_categori` (`id_categori`),
  KEY `FK_posts_matkul` (`id_matkul`),
  CONSTRAINT `FK_posts_categori` FOREIGN KEY (`id_categori`) REFERENCES `categori` (`id_categori`),
  CONSTRAINT `FK_posts_matkul` FOREIGN KEY (`id_matkul`) REFERENCES `matkul` (`id_matkul`),
  CONSTRAINT `FK_posts_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table webppsi.posts: ~6 rows (approximately)
INSERT INTO `posts` (`id_post`, `id_user`, `id_categori`, `id_matkul`, `title`, `excerpt`, `description`, `uploaded_file`, `created_at`, `updated_at`) VALUES
	(8, 3, 2, 9, 'TB website PTB angkatan 21', ' 3 types of customer complaints  Though there are a variety of issues a customer may have, realistically there are a few distinct buckets that a majority of requests fit into: ', '<div>Empty</div>', '1699584301135-unand.png', '2023-11-10 02:45:01', '2023-11-10 02:45:01'),
	(9, 3, 2, 10, 'Project peta digital GIS', 'Pastikan untuk menggunakan kedua pendekatan ini untuk menangani sebagian besar browser. Jika browser mendukung ', '<div>~ Empty ~</div>', '1699594009709-pembukaan.docx', '2023-11-10 05:26:49', '2023-11-10 05:26:49'),
	(11, 1, 1, 4, 'Queue, Sorting, Linkedlist', 'And I am not that special for saying that. Most of us want to leave an imprint on the world that', '<div>Empty</div>', '1700193089301-Proposal Pembuatan Web Portal Berita.docx', '2023-11-17 03:51:29', '2023-11-17 03:51:29'),
	(12, 1, 1, 3, 'Inheritance, Polymorphisme, Encapsulation', ' 3 types of customer complaints  Though there are a variety of issues a customer may have, realistically there are a few distinct buckets that a majority of requests fit into: ', '<div>Empty</div>', '1700193170204-SOP LABGIS Scan.pdf', '2023-11-17 03:52:50', '2023-11-17 03:52:50');

-- Dumping structure for table webppsi.users
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `role` varchar(50) DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `about` text,
  `nim` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table webppsi.users: ~4 rows (approximately)
INSERT INTO `users` (`id_user`, `role`, `email`, `username`, `password`, `avatar`, `about`, `nim`) VALUES
	(1, 'admin', 'fikranelyafit@gmail.com', 'Admin', '$2b$10$hCHGWVxIHwnJtUb/awU1DOe1FjMNKjLZR.nTVITm30S6n.pG9m3yW', '1699420412969-2.jpg', 'Lindsay loves creating educational content for marketers – check out HubSpot Academy\'s video course on SEO that she produced alongside SEO expert Matthew Howells-Barby.', '2111526715'),
	(3, NULL, 'aam@gmail.com', 'aam', '$2b$10$I7n/jlvNpSlX.Zt/5F3rcu2eAQxXCRU4KVn9QRv25GjZBDuZEjTL2', NULL, NULL, NULL),
	(5, NULL, NULL, 'Muhammad ikhlas', '$2b$10$4FBq9o8yxbNXYb7No6CEEuOWNuw6.OfsQR5GLCvW2pFl0d4bNj7nG', '1697789526558-7.jpg', 'I am batman and i am single', '2111521432'),
	(6, NULL, 'user1@gmail.com', NULL, '$2b$10$XHhprlLuUO.3OEQ1VE0cSeB3WbBRHGsaJk4kwHViOEC8VEI3iwnj6', '1700014620917-2.jpg', '', ''),
	(7, NULL, 'joni@gmail.com', NULL, '$2b$10$qNbtAh1URpn23G18xsw5WufBaRvq90JUd4QEjKRFbd6pRbAfG7Ql2', NULL, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
ppsitb