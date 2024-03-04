-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: culti_verse_db
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `group_noumenons`
--

DROP TABLE IF EXISTS `group_noumenons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_noumenons` (
  `NID` varchar(255) DEFAULT NULL,
  `PID` varchar(255) DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Name_e` varchar(255) DEFAULT NULL,
  KEY `PID` (`PID`),
  KEY `NID` (`NID`),
  CONSTRAINT `group_noumenons_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `paintings` (`PID`),
  CONSTRAINT `group_noumenons_ibfk_2` FOREIGN KEY (`NID`) REFERENCES `noumenons` (`NID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_noumenons`
--

LOCK TABLES `group_noumenons` WRITE;
/*!40000 ALTER TABLE `group_noumenons` DISABLE KEYS */;
INSERT INTO `group_noumenons` VALUES ('16+146+147','5872',NULL,NULL),('23+128','598',NULL,NULL);
/*!40000 ALTER TABLE `group_noumenons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metaphors`
--

DROP TABLE IF EXISTS `metaphors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metaphors` (
  `MID` varchar(255) NOT NULL,
  `Symbol` varchar(255) DEFAULT NULL,
  `Symbol_e` varchar(255) DEFAULT NULL,
  `NormType` varchar(255) DEFAULT NULL,
  `NormType_e` varchar(255) DEFAULT NULL,
  `Custom` varchar(1024) DEFAULT NULL,
  `Custom_e` varchar(1024) DEFAULT NULL,
  `Emotion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metaphors`
--

LOCK TABLES `metaphors` WRITE;
/*!40000 ALTER TABLE `metaphors` DISABLE KEYS */;
INSERT INTO `metaphors` VALUES ('104.1','灵芝','herb of immortality','相同','Iconic','植物灵芝。','nan','Neutral'),('104.2','长寿','nan','同义','Synonym','灵芝生长缓慢、不易寻找,在中国古代也象征着人们对于理想生活的追求和向往。','nan','Positive'),('105.1','白鹭','heron','相同','Iconic','动物白鹭。','nan','Neutral'),('105.2','仕途','nan','同音','Homophony','“鹭”与“路”同音，寓指路途、仕途、命运。','nan','Neutral'),('105+107+61.1','荣华富贵','','同音','Homophony','鹭与路同音，蓉与荣同音，桂与贵同音。白鹭和芙蓉花、桂花等融合入画，寓意人生旅途“一路荣华富贵”。','',''),('105+120.1','吉祥','','同义','Synonym','白鹭是长寿、幸福的象征,荷花代表人世代绵延，家道昌盛，两者一起有吉祥美好的寓意。','',''),('105+120.2','高洁','','同义','Synonym','白鹭洁白美好、心存高洁；荷花出于淤泥而不染，象征君子品质高洁。','',''),('115.1','荔枝','lichee','相同','Iconic','水果荔枝。','nan','Neutral'),('115.2','早生贵子','nan','同义','Synonym','在中国北方，以干龙眼和荔枝放在新婚夫妇的床上，祝他们早日有孩子。','nan','Positive'),('115.3','吉利','nan','同音','Homophony','荔与利同音，代表吉利的寓意','nan','Positive'),('115+63.1','大吉大利','','谐音','Homophonic pun','荔和利同音，鸡与吉谐音。因此荔枝和鸡组合出现在国画中，代表“大吉大利”的吉祥寓意。','',''),('119.1','枇杷','loquat','相同','Iconic','水果枇杷。','nan','Neutral'),('119.2','吉祥','nan','同义','Synonym','在秋日养霜，在冬日开花，而在春日结果，在夏日成熟，一直就被人们称作是“备四时之气”的佳果，被人们视为吉祥的食物。','nan','Positive'),('119.3','多子','nan','同形','Homograph','枇杷果实成熟时，在绿叶丛中，累累金黄，圆润可爱，寓意子嗣昌盛，多子多福。','nan','Positive'),('120.1','莲花','lotus','相同','Iconic','植物莲花。','nan','Neutral'),('120.2','洁净','nan','同形','Homograph','出淤泥而不染，里面空，外面直，没有枝杈，香气扑鼻。','nan','Positive'),('120.3','爱情','nan','同音','Homophony','谐音“连”“联”，寓意夫妻关系美满，恩爱幸福。','nan','Positive'),('123.1','喜鹊','magpie','相同','Iconic','动物喜鹊。','nan','Neutral'),('123.2','好消息','nan','同义','Synonym','喜鹊的叫声预告着好消息或者客人的到来。','nan','Positive'),('123.3','爱情','nan','同义','Synonym','中国的民俗故事里，在七夕节，所有地球上的喜鹊会飞离地球，飞到银河上搭一座桥，使得牛郎织女可以重新会面。','nan','Positive'),('128.1','猴','monkey','相同','Iconic','动物猴。','nan','Neutral'),('128.2','侯','nan','同音','Homophony','猴与“侯”同音，祝福对方受封做官。','nan','Positive'),('128.3','孙悟空','nan','同义','Synonym','孙悟空是中国古典神魔小说《西游记》中的人物。孙悟空生性聪明、活泼、忠诚、嫉恶如仇，在民间文化中代表了机智、勇敢。','nan','Positive'),('128+108.1','马上封侯','','同音','Homophony','猴与侯谐音，和马同时出现在一幅作品中时，即寓意马上封侯','',''),('128+140.1','长寿','','同义','Synonym','在祝寿主题的绘画中，经常会出现一只长臂猿猴手捧寿桃的场景，猴子献桃有祝福长寿安康之意。','',''),('128+54.1','长寿','','谐音','Homophonic pun','猫谐音耄，猴与猫同时出现在一幅作品寓意是延年益寿。','',''),('128+70.1','升官发财','','同音','Homophony','猴与“侯”、鹿与“禄”的谐音，表达高侯多禄的美好愿望。','',''),('130.1','水仙','narcissus','相同','Iconic','植物水仙。','nan','Neutral'),('130.2','幸运','nan','同形','Homograph','在新年前后开花，成为来年走运的标志。','nan','Positive'),('133.1','兰花','orchid','相同','Iconic','植物兰花。','nan','Neutral'),('133.2','君子','nan','同形','Homograph','兰花生长在深山野谷，有清婉素淡的香气长葆本性之美。这种不以无人而不芳的“幽”，象征“人不知而不愠”的君子风格，一种不求仕途通达、不沽名钓誉、只追求胸中志向的坦荡胸襟，象征着疏远污浊政治、保全自己美好人格的品质。','nan','Positive'),('133.3','高雅','nan','同形','Homograph','兰花通常被视为高雅、高贵的象征，因为它们通常生长在高雅的环境中，如宫廷、寺庙等。','nan','Positive'),('133.4','纯洁','nan','同形','Homograph','兰花的花色通常为白色或淡粉色，象征着纯洁和高雅。','nan','Positive'),('133.5','友谊','nan','同义','Synonym','兰花被赠送给朋友，以表达友谊和尊重。','nan','Positive'),('133.6','爱情','nan','同义','Synonym','兰花被赠送给爱人，以表达爱情和浪漫。','nan','Positive'),('133.7','坚强','nan','同形','Homograph','兰花在寒冷的冬季也能生长和开花，被视为坚强的象征。','nan','Positive'),('137.1','鹦鹉','parrot','相同','Iconic','动物鹦鹉。','nan','Neutral'),('137.2','英明','nan','同音','Homophony','鹦鹉的谐音是“英武”，鹦鹉的叫声积极向上，给人一种欣欣向荣的正能量。所以鹦鹉的寓意又是英明神武，英姿勃勃的意思。','nan','Positive'),('140.1','桃','peach','相同','Iconic','水果桃。','nan','Neutral'),('140.2','辟邪','nan','同义','Synonym','桃木在古代被视为一种神木，具有镇鬼辟邪之效。','nan','Positive'),('140.3','长寿','nan','同义','Synonym','桃树的寿命相对较长，故被赋予了长寿的寓意。将桃子献给家中的长辈，表示吉祥、长寿的祝愿。','nan','Positive'),('141.1','孔雀','peacock','相同','Iconic','动物孔雀。','nan','Neutral'),('141.2','官','nan','同义','Synonym','中国古代文官的官服上绣有孔雀图案，表示官运通荣。','nan','Positive'),('141.3','吉祥','nan','同义','Synonym','寓意吉祥，幸福，美丽。','nan','Positive'),('141+143.1','富贵吉祥','','同义','Synonym','牡丹表富贵，孔雀表吉祥，孔雀与牡丹的组合表达富贵吉祥。','',''),('143.1','牡丹','peony','相同','Iconic','植物牡丹。','nan','Neutral'),('143.2','富贵','nan','同义','Synonym','被称为花之王后，表示富贵与荣誉。','nan','Positive'),('143+63.1','功名富贵','','同音','Homophony','公与功同音，公鸡打鸣的鸣与名同音，鸡鸣报晓，牡丹盛开，牡丹与公鸡组图，寓意前程似锦，功名富贵。','',''),('146.1','松树','pine','相同','Iconic','植物松树。','nan','Neutral'),('146.2','长寿','nan','同形','Homograph','树高百尺，经年累月，松树长寿耐岁月的特性引发了人们对长寿的向往。','nan','Positive'),('146.3','顽强','nan','同形','Homograph','松树具有极强的生命力，即使在严寒的冬天，它依然挺拔如常，枝叶丰茂。用松树来象征顽强、坚持不懈的精神。','nan','Positive'),('146.4','正直','nan','同形','Homograph','松树挺拔而高大，没有花序和果实，生长在山岳之巅，远离尘嚣。松树被认为是不畏权贵、坚守正道的象征。','nan','Positive'),('147.1','梅','plum','相同','Iconic','植物梅花。','nan','Neutral'),('147.2','报喜','nan','同形','Homograph','在中国旧历的一、二月间开花。被人们看作是传春报喜的吉祥象征。','nan','Positive'),('147.3','君子','nan','同形','Homograph','为花中“四君子”之首，也是“岁寒三友”之一。梅花所处环境恶劣，却仍在凌厉寒风中傲然绽放于枝头，体现了梅花自强不息的傲雪的精神。','nan','Positive'),('147.4','长寿','nan','同形','Homograph','梅花是花中寿星，在中国很多地区存在千年古梅。','nan','Positive'),('147+16+123.1','喜悦','','同音','Homophony','梅与眉同音，喜雀与喜事的喜同音。画喜鹊站在梅梢上鸣叫，寓意喜上眉梢、喜事临门。','',''),('16.1','竹','bamboo','相同','Iconic','植物竹子。','nan','Neutral'),('16.2','长寿','nan','同义','Synonym','竹子在植物中寿命是长久的，所以人们喜欢用竹子来比喻长寿安宁等。','nan','Positive'),('16.3','骨气','nan','同形','Homograph','竹子即使弯曲也不会被折断，代表的是一种做人的精神风貌刚直不阿。','nan','Positive'),('16.4','君子','nan','同形','Homograph','竹的内部是空的，象征清虚自守。','nan','Positive'),('16.5','平安','nan','同义','Synonym','出自成语“竹报平安”，比喻报平安的家信。','nan','Positive'),('16.6','节节高','nan','同形','Homograph','一个是指职位的高升。另指孩子健康成长的祝福。','nan','Positive'),('16+146+147.1','清高孤傲,清风傲骨','','同形','Homograph','松、竹、梅被称为“岁寒三友”，因为它们在冬季仍能保持翠绿、坚韧的生命力，寓意着不屈不挠、坚韧不拔的精神。','',''),('166.1','石','stone','相同','Iconic','物质石。','nan','Neutral'),('166.2','长寿','nan','同形','Homograph','石头是一种长寿的物质，可以经受住时间的考验，因此常常被用来象征长寿和永恒。','nan','Positive'),('188.1','柳','willow','相同','Iconic','植物柳树。','nan','Neutral'),('188.2','留','nan','谐音','Homophonic pun','柳与留谐音， 表达离别之情。','nan','Negative'),('188.3','故乡','nan','同义','Synonym','杨柳在中国大部分村庄都有种植，所以杨柳还被用来象征故乡。','nan','Neutral'),('188.4','驱邪','nan','同义','Synonym','柳“去恶辟邪”的寓意源于佛教，观音一手托净瓶，一手拿柳枝，以柳枝蘸净瓶中的水向人间抛洒甘露，祓病消灾。受此影响，便以柳为驱邪消灾之吉祥物。','nan','Positive'),('188.5','漂泊','nan','同形','Homograph','柳枝飘摇，柳絮分飞不定，象征着人物的漂泊不定。','nan','Negative'),('188.6','春天','nan','同义','Synonym','柳树在初春抽枝发芽,所以“柳”又代指春天。','nan','Positive'),('197.1','麻雀','nan','相同','Iconic','动物麻雀','nan','Neutral'),('197.2','加官进爵','nan','谐音','Homophonic pun','雀谐音“爵”，寓意着加官进爵，为人们带来好运和富贵。','nan','Positive'),('197.3','吉祥','nan','同义','Synonym','寓意五谷丰登，风调雨顺，为人们带来丰收的喜悦。','nan','Positive'),('198.1','伯劳','shrike','相同','Iconic','动物伯劳。','nan','Neutral'),('198.2','不祥','nan','同义','Synonym','生性凶猛。在一个传说中，被父亲杀死的儿子化身伯劳，回到父亲身边。','nan','Negative'),('198.3','图腾','nan','同义','Synonym','伯劳鸟是东夷五大部族的图腾之一，掌管夏至冬至。','nan','Positive'),('199.1','绶带鸟','paradise flycatcher','相同','Iconic','动物绶带鸟。','nan','Neutral'),('199.2','长寿','nan','同音','Homophony','“绶”与“寿”同音，象征长寿。','nan','Positive'),('199.3','官职','nan','同义','Synonym','绶带指代官职，象征官运亨通。','nan','Positive'),('200.1','红蓼','smartweed','相同','Iconic','植物红蓼。','nan','Neutral'),('200.2','凄清','nan','同义','Synonym','在秋天开花，正值万物衰亡之时。','nan','Negative'),('201.1','鹅','goose','相同','Iconic','动物鹅。','nan','Neutral'),('201.2','爱情','nan','同义','Synonym','鹅保持着一种动物界中稀有的“终身伴侣制”,是世界上最钟情的生灵。被寓意为忠贞、永恒的爱情的代表。','nan','Positive'),('202.1','鸢尾','iris','相同','Iconic','植物鸢尾。','nan','Neutral'),('202.2','纯真','nan','同义','Synonym','白色的鸢尾代表纯真。','nan','Positive'),('202.3','热情开朗','nan','同义','Synonym','黄色的鸢尾代表热情开朗。','nan','Positive'),('202.4','素雅大方','nan','同义','Synonym','蓝色的鸢尾代表素养大方。','nan','Positive'),('202.5','爱情和友谊','nan','同义','Synonym','鸢尾花代表恋爱使者,鸢尾的花语是长久思念。','nan','Positive'),('203.1','海棠花','begonia','相同','Iconic','植物海棠花。','nan','Neutral'),('203.2','美丽高贵','nan','同义','Synonym','海棠明艳美丽。','nan','Positive'),('204.1','山茶花','camellia','相同','Iconic','植物山茶花。','nan','Neutral'),('204.2','吉祥、长寿','nan','同义','Synonym','花朵宛如牡丹，艳丽、娇媚，给人们带来无限生机和希望。','nan','Positive'),('205.1','翠鸟','kingfisher','相同','Iconic','动物翠鸟。','nan','Neutral'),('205.2','吉祥如意','nan','同义','Synonym','是收获和好运的象征。','nan','Positive'),('206.1','萱草花','daylily','相同','Iconic','植物萱草花。','nan','Neutral'),('206.2','母亲','nan','同音','Homophony','与中国人对母亲的敬称相同同音。','nan','Positive'),('206.3','忘记烦恼','nan','同义','Synonym','萱草，又名忘忧草。','nan','Positive'),('207.1','稻穗','ear of rice','相同','Iconic','植物稻穗。','nan','Neutral'),('207.2','富足','nan','同形','Homograph','稻谷的寓意是丰收，象征着富足有余。','nan','Positive'),('208.1','螃蟹','crab','相同','Iconic','动物螃蟹。','nan','Neutral'),('208.2','金榜题名','nan','同音','Homophony','谐音“解元”，即第一名','nan','Positive'),('208.3','不守礼法、背弃仕途','nan','讽刺','Starie','薛宝钗所作的《咏螃蟹》，斥责不守礼法、背弃仕途的叛逆行为。','nan','Negative'),('209.1','蜻蜓','dragonfly','相同','Iconic','动物蜻蜓。','nan','Neutral'),('209.2','亭亭玉立','nan','同音','Homophony','蜻蜓象征亭亭玉立。','nan','Positive'),('209.3','青云直上','nan','同义','Synonym','蜻蜓：象征神秘、青云直上。','nan','Positive'),('209.4','情投意合','nan','谐音','Homophonic pun','蜻蜓的“蜻”与“情”读音相近，有情投意合的意思。','nan','Positive'),('23.1','蜜蜂','bee','相同','Iconic','动物蜜蜂。','nan','Neutral'),('23.2','勤劳','nan','同形','Homograph','蜜蜂在短暂的一生中几乎没有从工作中停歇过，象征着勤劳的精神。','nan','Positive'),('23.3','封赏','nan','同音','Homophony','蜂与封谐音，寓意奖赏。','nan','Positive'),('23+128.1','封侯','','同音','Homophony','猴与侯谐音，封与蜂同音，和猴与蜂同时出现在一幅作品中时，即寓意封侯。','',''),('25.1','白头翁','chinese bulbul','相同','Iconic','动物白头翁。','nan','Neutral'),('25.2','长寿','nan','同形','Homograph','白头翁头部有白色的毛，用来比喻夫妻和睦，“白头偕老”。','nan','Positive'),('25+143.1','爱情','','同音','Homophony','寓意白头偕老。','',''),('44.1','蝴蝶','butterfly','相同','Iconic','动物蝴蝶','nan','Neutral'),('44.2','长寿','nan','同音','Homophony','“蝶”与“耋”同音。耋是老年的意思，表达祝福长寿。','nan','Positive'),('44.3','爱情','nan','同义','Synonym','出自《梁祝》古代小说，象征生死相依的爱情。','nan','Positive'),('44+147.1','希望','','同义','Homophony','梅花在严寒的冬季中绽放，寓意着不畏艰难和不屈的精神。蝴蝶则象征着自由、美丽和变化。蝴蝶与梅花一起象征着希望、自由和幸福。','',''),('44+54.1','长寿','','谐音','Homophonic pun','猫蝶与耄耋谐音，耄耋表示八九十岁的人。希望该画的受赠者长寿。','',''),('54.1','猫','cat','相同','Iconic','动物猫。','nan','Neutral'),('54.2','长寿','nan','谐音','Homophonic pun','猫与“耄”谐音，是老年的意思，表达祝福长寿。','nan','Positive'),('59.1','菊','chrysanthemums','相同','Iconic','植物菊。','nan','Neutral'),('59.2','秋季','nan','同义','Synonym','菊花在秋季开放','nan','Neutral'),('59.3','高尚品格','nan','同形','Homograph','菊花在深秋寒霜季节依然盛开，它是花中四君子之一，其高傲的气节赋予了它高尚情操的寓意。','nan','Positive'),('59.4','潇洒隐逸','nan','同义','Synonym','菊花又被称为隐士之花，它寓意着远离世俗的纷扰和富贵，向往山林间的自在与潇洒生活。','nan','Positive'),('59.5','长寿','nan','同义','Synonym','菊花的盛开期在九月份，与“久”字谐音，因此它寓意着长寿吉祥。','nan','Positive'),('59.6','飞黄腾达','nan','同形','Homograph','菊花的花色为黄色，黄色在古代又与皇权、富贵相联系。因此，黄菊有着飞黄腾达的寓意。','nan','Positive'),('59+146.1','长寿','','同义','Synonym','菊花与松树画在一起，叫做“松菊永存”，表示祝愿接受此画的人长寿。','',''),('63.1','公鸡','cock','相同','Iconic','动物公鸡。','nan','Neutral'),('63.2','避开灾祸','nan','同义','Synonym','据说公鸡可以避开灾祸，例如，一只红公鸡，可以保护房子不遭火灾。','nan','Positive'),('63.3','吉','nan','谐音','Homophonic pun','鸡与吉谐音，表示“吉祥如意”。','nan','Positive'),('7.1','苹果','apple','相同','Iconic','水果苹果。','nan','Neutral'),('7.2','平安','nan','同音','Homophony','苹与平同音，寓意平安。','nan','Positive'),('75.1','龙','loong','相同','Iconic','中国传说中的神异动物。','nan','Neutral'),('75.2','自由','nan','同义','Synonym','龙可以带人飞升天界，是通达自由境界的坐骑，所以龙就是自由的象征。','nan','Positive'),('75.3','皇帝','nan','同义','Synonym','从汉代开始，龙成为天子的象征。','nan','Positive'),('8.1','杏花','apricot flower','相同','Iconic','植物杏花。','nan','Positive'),('8.2','出轨','nan','同音','Homophony','红杏出墙是成语，象征已婚妇人与情人私通。','nan','Negative'),('8.3','幸福','nan','同音','Homophony','杏与幸同音，表示幸福。','nan','Positive');
/*!40000 ALTER TABLE `metaphors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noumenon_metaphors`
--

DROP TABLE IF EXISTS `noumenon_metaphors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noumenon_metaphors` (
  `NID` varchar(255) NOT NULL,
  `MID` varchar(255) NOT NULL,
  `COUNT` int DEFAULT NULL,
  `NormType` varchar(255) DEFAULT NULL,
  `NormType_e` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`NID`,`MID`),
  KEY `MID` (`MID`),
  CONSTRAINT `noumenon_metaphors_ibfk_1` FOREIGN KEY (`NID`) REFERENCES `noumenons` (`NID`),
  CONSTRAINT `noumenon_metaphors_ibfk_2` FOREIGN KEY (`MID`) REFERENCES `metaphors` (`MID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noumenon_metaphors`
--

LOCK TABLES `noumenon_metaphors` WRITE;
/*!40000 ALTER TABLE `noumenon_metaphors` DISABLE KEYS */;
INSERT INTO `noumenon_metaphors` VALUES ('104','104.1',1,'相同','Iconic'),('104','104.2',1,'同义','Synonym'),('105','105.1',1,'相同','Iconic'),('105','105.2',1,'同音','Homophony'),('105+107+61','105+107+61.1',1,'同音','Homophony'),('105+120','105+120.1',2,'同义','Synonym'),('105+120','105+120.2',2,'同义','Synonym'),('115','115.1',1,'相同','Iconic'),('115','115.2',1,'同义','Synonym'),('115','115.3',1,'同音','Homophony'),('115+63','115+63.1',1,'谐音','Homophonic pun'),('119','119.1',1,'相同','Iconic'),('119','119.2',1,'同义','Synonym'),('119','119.3',1,'同形','Homograph'),('120','120.1',1,'相同','Iconic'),('120','120.2',1,'同形','Homograph'),('120','120.3',1,'同音','Homophony'),('123','123.1',1,'相同','Iconic'),('123','123.2',2,'同义','Synonym'),('123','123.3',2,'同义','Synonym'),('128','128.1',1,'相同','Iconic'),('128','128.2',1,'同音','Homophony'),('128','128.3',1,'同义','Synonym'),('128+108','128+108.1',1,'同音','Homophony'),('128+140','128+140.1',1,'同义','Synonym'),('128+54','128+54.1',1,'谐音','Homophonic pun'),('128+70','128+70.1',1,'同音','Homophony'),('130','130.1',1,'相同','Iconic'),('130','130.2',1,'同形','Homograph'),('133','133.1',1,'相同','Iconic'),('133','133.2',4,'同形','Homograph'),('133','133.3',4,'同形','Homograph'),('133','133.4',4,'同形','Homograph'),('133','133.5',2,'同义','Synonym'),('133','133.6',2,'同义','Synonym'),('133','133.7',4,'同形','Homograph'),('137','137.1',1,'相同','Iconic'),('137','137.2',1,'同音','Homophony'),('140','140.1',1,'相同','Iconic'),('140','140.2',2,'同义','Synonym'),('140','140.3',2,'同义','Synonym'),('141','141.1',1,'相同','Iconic'),('141','141.2',2,'同义','Synonym'),('141','141.3',2,'同义','Synonym'),('141+143','141+143.1',1,'同义','Synonym'),('143','143.1',1,'相同','Iconic'),('143','143.2',1,'同义','Synonym'),('143+63','143+63.1',1,'同音','Homophony'),('146','146.1',1,'相同','Iconic'),('146','146.2',3,'同形','Homograph'),('146','146.3',3,'同形','Homograph'),('146','146.4',3,'同形','Homograph'),('147','147.1',1,'相同','Iconic'),('147','147.2',3,'同形','Homograph'),('147','147.3',3,'同形','Homograph'),('147','147.4',3,'同形','Homograph'),('147+16+123','147+16+123.1',1,'同音','Homophony'),('16','16.1',1,'相同','Iconic'),('16','16.2',2,'同义','Synonym'),('16','16.3',3,'同形','Homograph'),('16','16.4',3,'同形','Homograph'),('16','16.5',2,'同义','Synonym'),('16','16.6',3,'同形','Homograph'),('16+146+147','16+146+147.1',1,'同形','Homograph'),('166','166.1',1,'相同','Iconic'),('166','166.2',1,'同形','Homograph'),('188','188.1',1,'相同','Iconic'),('188','188.2',1,'谐音','Homophonic pun'),('188','188.3',3,'同义','Synonym'),('188','188.4',3,'同义','Synonym'),('188','188.5',1,'同形','Homograph'),('188','188.6',3,'同义','Synonym'),('197','197.1',1,'相同','Iconic'),('197','197.2',1,'谐音','Homophonic pun'),('197','197.3',1,'同义','Synonym'),('198','198.1',1,'相同','Iconic'),('198','198.2',2,'同义','Synonym'),('198','198.3',2,'同义','Synonym'),('199','199.1',1,'相同','Iconic'),('199','199.2',1,'同音','Homophony'),('199','199.3',1,'同义','Synonym'),('200','200.1',1,'相同','Iconic'),('200','200.2',1,'同义','Synonym'),('201','201.1',1,'相同','Iconic'),('201','201.2',1,'同义','Synonym'),('202','202.1',1,'相同','Iconic'),('202','202.2',4,'同义','Synonym'),('202','202.3',4,'同义','Synonym'),('202','202.4',4,'同义','Synonym'),('202','202.5',4,'同义','Synonym'),('203','203.1',1,'相同','Iconic'),('203','203.2',1,'同义','Synonym'),('204','204.1',1,'相同','Iconic'),('204','204.2',1,'同义','Synonym'),('205','205.1',1,'相同','Iconic'),('205','205.2',1,'同义','Synonym'),('206','206.1',1,'相同','Iconic'),('206','206.2',1,'同音','Homophony'),('206','206.3',1,'同义','Synonym'),('207','207.1',1,'相同','Iconic'),('207','207.2',1,'同形','Homograph'),('208','208.1',1,'相同','Iconic'),('208','208.2',1,'同音','Homophony'),('208','208.3',1,'讽刺','Starie'),('209','209.1',1,'相同','Iconic'),('209','209.2',1,'同音','Homophony'),('209','209.3',1,'同义','Synonym'),('209','209.4',1,'谐音','Homophonic pun'),('23','23.1',1,'相同','Iconic'),('23','23.2',1,'同形','Homograph'),('23','23.3',1,'同音','Homophony'),('23+128','23+128.1',1,'同音','Homophony'),('25','25.1',1,'相同','Iconic'),('25','25.2',1,'同形','Homograph'),('25+143','25+143.1',1,'同音','Homophony'),('44','44.1',1,'相同','Iconic'),('44','44.2',1,'同音','Homophony'),('44','44.3',1,'同义','Synonym'),('44+147','44+147.1',1,'同义','Homophony'),('44+54','44+54.1',1,'谐音','Homophonic pun'),('54','54.1',1,'相同','Iconic'),('54','54.2',1,'谐音','Homophonic pun'),('59','59.1',1,'相同','Iconic'),('59','59.2',3,'同义','Synonym'),('59','59.3',2,'同形','Homograph'),('59','59.4',3,'同义','Synonym'),('59','59.5',3,'同义','Synonym'),('59','59.6',2,'同形','Homograph'),('59+146','59+146.1',1,'同义','Synonym'),('63','63.1',1,'相同','Iconic'),('63','63.2',1,'同义','Synonym'),('63','63.3',1,'谐音','Homophonic pun'),('7','7.1',1,'相同','Iconic'),('7','7.2',1,'同音','Homophony'),('75','75.1',1,'相同','Iconic'),('75','75.2',2,'同义','Synonym'),('75','75.3',2,'同义','Synonym'),('8','8.1',1,'相同','Iconic'),('8','8.2',2,'同音','Homophony'),('8','8.3',2,'同音','Homophony');
/*!40000 ALTER TABLE `noumenon_metaphors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noumenons`
--

DROP TABLE IF EXISTS `noumenons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noumenons` (
  `NID` varchar(255) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Name_e` varchar(255) DEFAULT NULL,
  `TIMES` int NOT NULL,
  PRIMARY KEY (`NID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noumenons`
--

LOCK TABLES `noumenons` WRITE;
/*!40000 ALTER TABLE `noumenons` DISABLE KEYS */;
INSERT INTO `noumenons` VALUES ('104','灵芝','herb of immortality',0),('105','白鹭','heron',4),('105+107+61','白鹭/芙蓉/桂','',0),('105+120','白鹭/莲花','',0),('115','荔枝','lichee',2),('115+63','荔枝/公鸡','',0),('119','枇杷','loquat',1),('120','莲花','lotus',4),('123','喜鹊','magpie',1),('128','猴','monkey',3),('128+108','猴/马','',0),('128+140','猴/桃子','',0),('128+54','猴/猫','',0),('128+70','猴/鹿','',0),('130','水仙','narcissus',3),('133','兰花','orchid',9),('137','鹦鹉','parrot',0),('140','桃','peach',3),('141','孔雀','peacock',4),('141+143','孔雀/牡丹','',0),('143','牡丹','peony',0),('143+63','牡丹/公鸡','',0),('146','松','pine',1),('147','梅','plum',0),('147+16+123','梅/竹/喜鹊','',0),('16','竹','bamboo',5),('16+146+147','竹/松/梅','',1),('166','石','stone',4),('188','柳','willow',1),('197','麻雀','sparrow',18),('198','伯劳','shrike',1),('199','绶带鸟','paradise flycatcher',0),('200','红蓼','smartweed',1),('201','鹅','goose',1),('202','鸢尾','iris',0),('203','海棠','begonia',0),('204','茶花','camellia',9),('205','翠鸟','kingfisher',1),('206','萱草花','daylily',0),('207','稻穗','ear of rice',0),('208','螃蟹','crab',0),('209','蜻蜓','dragonfly',0),('23','蜜蜂','bee',4),('23+128','蜜蜂/猴','',1),('25','白头翁','chinese bulbul',0),('25+143','白头翁/牡丹','',0),('44','蝴蝶','butterfly',5),('44+147','蝴蝶/梅','',0),('44+54','蝴蝶/猫','',0),('54','猫','cat',2),('59','菊','chrysanthemums',3),('59+146','菊/松','',0),('63','公鸡','cock',0),('7','苹果','apple',2),('75','龙','loong',0),('8','杏花','apricot flower',1);
/*!40000 ALTER TABLE `noumenons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `painting_noumenon_boxes`
--

DROP TABLE IF EXISTS `painting_noumenon_boxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `painting_noumenon_boxes` (
  `PNBID` int NOT NULL AUTO_INCREMENT,
  `PID` varchar(255) DEFAULT NULL,
  `NID` varchar(255) DEFAULT NULL,
  `PositionX` float NOT NULL,
  `PositionY` float NOT NULL,
  `Width` float NOT NULL,
  `Height` float NOT NULL,
  PRIMARY KEY (`PNBID`),
  KEY `PID` (`PID`),
  KEY `NID` (`NID`),
  CONSTRAINT `painting_noumenon_boxes_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `paintings` (`PID`),
  CONSTRAINT `painting_noumenon_boxes_ibfk_2` FOREIGN KEY (`NID`) REFERENCES `noumenons` (`NID`)
) ENGINE=InnoDB AUTO_INCREMENT=745 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `painting_noumenon_boxes`
--

LOCK TABLES `painting_noumenon_boxes` WRITE;
/*!40000 ALTER TABLE `painting_noumenon_boxes` DISABLE KEYS */;
INSERT INTO `painting_noumenon_boxes` VALUES (652,'14041','16',0.0932679,0.265384,0.66046,0.491806),(653,'14041','197',0.431199,0.331389,0.268046,0.123967),(654,'14041','197',0.161287,0.505442,0.176269,0.110049),(655,'14041','197',0.478263,0.532789,0.106943,0.0653376),(656,'14041','197',0.476087,0.462352,0.139244,0.0375974),(657,'14041','197',0.399954,0.270026,0.104407,0.108258),(658,'15023','115',0.0198414,0.133164,0.965672,0.711896),(659,'15023','115',0.126755,0.28079,0.340483,0.464563),(660,'15023','198',0.583442,0.399562,0.148722,0.200656),(661,'14042','188',0.0965068,0.261697,0.664671,0.497433),(662,'14042','197',0.463609,0.503038,0.162408,0.150025),(663,'14042','197',0.650248,0.432139,0.0620982,0.0426973),(664,'14042','197',0.297866,0.483296,0.188652,0.132737),(665,'14042','197',0.490325,0.437511,0.0473712,0.0511799),(666,'14042','197',0.547826,0.452318,0.0995062,0.0420832),(667,'14042','197',0.611884,0.599985,0.121939,0.0629478),(668,'14042','197',0.484125,0.335975,0.110924,0.0905041),(669,'14042','197',0.315527,0.585482,0.105772,0.0321236),(670,'14042','197',0.661103,0.512071,0.0981571,0.111466),(671,'322','119',0.541496,0.344576,0.344071,0.423103),(672,'1252','141',0.129966,0.395219,0.685232,0.522941),(673,'1252','141',0.0316861,0.551735,0.391566,0.269664),(674,'1252','141',0.0213709,0.242247,0.277699,0.0846334),(675,'1252','141',0.621561,0.744146,0.269656,0.195018),(676,'1265','200',0.0659286,0.204402,0.727493,0.626549),(677,'1265','201',0.150641,0.558695,0.53023,0.233632),(678,'468','8',0.552554,0.410661,0.309115,0.383407),(679,'1276','133',0.452533,0.103089,0.224656,0.0842205),(680,'1276','133',0.671293,0.245506,0.226161,0.0893487),(681,'1276','133',0.235592,0.399712,0.246954,0.0805125),(682,'1276','133',0.343102,0.219433,0.243678,0.0876931),(683,'1276','133',0.152839,0.177115,0.20847,0.0907397),(684,'1276','133',0.124862,0.5622,0.20512,0.0921276),(685,'1276','133',0.788508,0.178938,0.184805,0.0583827),(686,'1276','133',0.743615,0.390464,0.233305,0.0767418),(687,'1276','133',0.118327,0.103495,0.855042,0.551391),(688,'1313','105',0.241074,0.332845,0.248199,0.0936125),(689,'1313','105',0.807561,0.0771864,0.163298,0.0587206),(690,'1313','105',0.440973,0.390153,0.178119,0.0674462),(691,'1313','105',0.111713,0.56457,0.0520686,0.0254881),(692,'5977','59',0.0384429,0.311701,0.907174,0.663941),(693,'320','7',0.603775,0.627222,0.0573335,0.0628819),(694,'320','7',0.556648,0.355242,0.309808,0.406714),(695,'17465','16',0.00760391,0.127698,0.982017,0.641937),(696,'17465','16',0.417673,0.861073,0.116856,0.135304),(697,'17465','166',0.229205,0.551961,0.160377,0.18742),(698,'17465','166',0.586809,0.608254,0.160724,0.151381),(699,'17465','166',0.358619,0.314057,0.25851,0.445016),(700,'14606','204',0.666188,0.429743,0.138667,0.146724),(701,'14606','204',0.183147,0.359591,0.25863,0.332711),(702,'14606','204',0.547737,0.415593,0.263614,0.278479),(703,'5498','140',0.256589,0.267396,0.249214,0.0798248),(704,'5498','140',0.498749,0.530731,0.244824,0.072153),(705,'5498','140',0.458696,0.242633,0.238985,0.0743708),(706,'5872','146',0.0950198,0.0297832,0.869283,0.927923),(707,'5876','120',0.288629,0.439695,0.33364,0.124356),(708,'5876','120',0.0529914,0.282241,0.828502,0.637287),(709,'5876','120',0.349056,0.28088,0.150931,0.0540774),(710,'3394','120',0.0623915,0.255895,0.875653,0.709125),(711,'3394','205',0.297235,0.408044,0.274506,0.0719834),(712,'3452','166',0.0830471,0.554956,0.60814,0.321382),(713,'3452','44',0.280945,0.271206,0.129209,0.0609791),(714,'5493','204',0.573116,0.620912,0.0642233,0.0216765),(715,'5493','204',0.140701,0.574129,0.128785,0.0449439),(716,'5493','204',0.226077,0.777291,0.113043,0.0412734),(717,'5493','204',0.340856,0.540545,0.121276,0.024073),(718,'5493','204',0.2883,0.585014,0.0697623,0.0332041),(719,'5493','204',0.802541,0.655962,0.0808404,0.0498971),(720,'5906','130',0.552563,0.185857,0.184378,0.0662419),(721,'5906','130',0.336644,0.0809565,0.0814204,0.0792086),(722,'5906','130',0.472895,0.88391,0.103674,0.0233322),(723,'5850','59',0.268335,0.37756,0.389964,0.147002),(724,'5850','59',0.0355212,0.375829,0.801522,0.475472),(725,'5850','44',0.0819232,0.442396,0.21744,0.0569093),(726,'5850','44',0.726135,0.561956,0.202715,0.0449069),(727,'5850','44',0.203606,0.776517,0.460656,0.166761),(728,'3213','54',0.544475,0.610219,0.390644,0.288456),(729,'3213','54',0.175092,0.403671,0.406428,0.225344),(730,'3213','16',0.153453,0.568229,0.425998,0.281518),(731,'3213','197',0.560091,0.18557,0.14916,0.0558207),(732,'3213','197',0.775337,0.167322,0.119005,0.0654668),(733,'3213','197',0.21808,0.138018,0.0543616,0.0492023),(734,'3213','197',0.132774,0.103529,0.0773738,0.0427402),(735,'3214','44',0.595432,0.296209,0.0496362,0.0270519),(736,'3344','123',0.333189,0.4669,0.624264,0.216318),(737,'598','23',0.20621,0.211384,0.343171,0.384053),(738,'598','23',0.730165,0.227015,0.228623,0.14304),(739,'598','23',0.479162,0.0338107,0.113506,0.0531434),(740,'598','23',0.432582,0.0852763,0.0782346,0.0373562),(741,'3592','128',0.207414,0.415789,0.300515,0.264612),(742,'3592','128',0.480558,0.771622,0.188614,0.0975337),(743,'3592','128',0.559543,0.11323,0.317926,0.203026),(744,'3592','16',0.727778,0.0342282,0.249145,0.34376);
/*!40000 ALTER TABLE `painting_noumenon_boxes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paintings`
--

DROP TABLE IF EXISTS `paintings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paintings` (
  `PID` varchar(255) NOT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `Name_e` varchar(255) DEFAULT NULL,
  `Src` varchar(255) NOT NULL,
  `Material` varchar(255) DEFAULT NULL,
  `Material_e` varchar(255) DEFAULT NULL,
  `Color` varchar(255) DEFAULT NULL,
  `Color_e` varchar(255) DEFAULT NULL,
  `Size` varchar(255) DEFAULT NULL,
  `Size_e` varchar(255) DEFAULT NULL,
  `Dynasty` varchar(255) DEFAULT NULL,
  `Dynasty_e` varchar(255) DEFAULT NULL,
  `Author` varchar(255) DEFAULT NULL,
  `Author_e` varchar(255) DEFAULT NULL,
  `Collection` varchar(255) DEFAULT NULL,
  `Collection_e` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`PID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paintings`
--

LOCK TABLES `paintings` WRITE;
/*!40000 ALTER TABLE `paintings` DISABLE KEYS */;
INSERT INTO `paintings` VALUES ('1252','枇杷孔雀图\n','nan','/picture/1252/1252_0.jpg','绢本 \n','nan','设色','nan','109.8×183.1厘米','nan','宋代','nan','崔白','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('1265','红蓼白鹅图','nan','/picture/1265/1265_0.jpg','\n绢本 \n设色 \n86.3×\n132.9厘米 \n宋代\n/赵佶 \n台北故宫博物院 \n7358×\n10929像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('1276','画牡丹图\n','nan','/picture/1276/1276_0.jpg','绢本 \n设色 \n59.3×\n143.5厘米 \n宋代\n/赵昌 \n台北故宫博物院 \n2560×\n6021像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('1313','三猿得鹭图\n','nan','/picture/1313/1313_0.jpg','绢本 \n设色 \n32.1×\n72.7厘米 \n宋代\n/易元吉 \n台北故宫博物院 \n1779×\n3929像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('14041','竹树驯雀图','nan','/picture/14041/14041_0.jpg','绢本 ','Silk','设色 ','color','24.8×24.8厘米 ','24.8×24.8cm','宋代','Song','佚名 ','anonymous','台北故宫博物院','The National Palace Museum in Taipei'),('14042','杨柳乳雀图\n','nan','/picture/14042/14042_0.jpg','绢本 \n','nan','设色','nan','24.8×24.8厘米 ','nan','宋代','nan','佚名 ','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('14152','花鸟图\n','nan','/picture/14152/14152_0.jpg','纸本 \n水墨 \n29.5×\n45.8厘米 \n宋代\n/赵昌 \n台北故宫博物院 \n2129×\n3285像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('14235','霖雨图轴\n','nan','/picture/14235/14235_0.jpg','绢本 \n设色 \n84.8×\n150.1厘米 \n宋代\n/佚名 \n台北故宫博物院 \n2063×\n3390像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('14606','山茶图\n','nan','/picture/14606/14606_0.jpg','绢本 \n设色 \n24.6×\n23.3厘米 \n五代十国\n/黄筌 \n台北故宫博物院 \n6203×\n8277像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('15023','离支伯赵国图','nan','/picture/15023/15023_0.jpg','绢本 \n','nan','设色','nan','24.8×25.5 厘米','nan','宋代','nan','佚名 ','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('17465','竹石图－元人集锦之一\n','nan','/picture/17465/17465_0.jpg','纸本 \n水墨 \n69.2×\n25.9厘米 \n元代\n/赵孟頫 \n台北故宫博物院 \n8213×\n4793像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('320','苹婆山鸟图\n','nan','/picture/320/320_0.jpg','绢本 \n设色 \n25.4×\n24.9厘米 \n清代\n/黄荃 \n台北故宫博物院 \n8249×\n6182像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('3213','写生图\n','nan','/picture/3213/3213_0.jpg','绢本 \n浅设色 \n61.8×\n84.6厘米 \n明代\n/商喜 \n台北故宫博物院 \n2259×\n3096像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('3214','秋葵图\n','nan','/picture/3214/3214_0.jpg','绢本 \n设色 \n78.2×\n128.5厘米 \n明代\n/商祚 \n台北故宫博物院 \n2065×\n3385像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('322','枇杷绶带图','nan','/picture/322/322_0.jpg','\n绢本 ','nan','设色 ','nan','27.8×25.7厘米','nan','宋代','nan','徐崇嗣','nan','台北故宫博物院','The National Palace Museum in Taipei'),('3245','郭索图\n','nan','/picture/3245/3245_0.jpg','纸本 \n水墨 \n31×\n49.4厘米 \n明代\n/沈周 \n台北故宫博物院 \n2133×\n3278像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('3344','杏花喜鹊图\n','nan','/picture/3344/3344_0.jpg','纸本 \n设色 \n34.3×\n116.6厘米 \n明代\n/钱谷 \n台北故宫博物院 \n1457×\n4798像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('3394','水面闻香图','nan','/picture/3394/3394_0.jpg','纸本 \n设色 \n43.8×\n106.8厘米 \n明代\n/文从简 \n台北故宫博物院 \n1490×\n4691像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('3452','花蝶图\n','nan','/picture/3452/3452_0.jpg','绢本 \n设色 \n47×\n149.3厘米 \n明代\n/赵文俶 \n台北故宫博物院 \n1549×\n4513像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('3592','戏猿图\n','nan','/picture/3592/3592_0.jpg','纸本 \n设色 \n127.7×\n162.3厘米 \n明代\n/朱瞻基 \n台北故宫博物院 \n2300×\n3041像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('468','写生杏花图\n','nan','/picture/468/468_0.jpg','绢本 \n设色 \n27.3×\n25.2厘米 \n宋代\n/赵昌 \n台北故宫博物院 \n6243×\n8304像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('5490','枇杷珍禽图\n','nan','/picture/5490/5490_0.jpg','绢本 \n设色 \n30.4×\n71.4厘米 \n明代\n/周之冕 \n台北故宫博物院 \n1821×\n3840像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('5493','双喜图\n','nan','/picture/5493/5493_0.jpg','纸本 \n设色 \n63.1×\n118.7厘米 \n明代\n/王维烈 \n台北故宫博物院 \n1684×\n4154像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('5498','蟠桃图\n','nan','/picture/5498/5498_0.jpg','纸本 \n设色 \n31.4×\n111.3厘米 \n明代\n/项圣谟 \n台北故宫博物院 \n1439×\n4857像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('5850','鸡图\n','nan','/picture/5850/5850_0.jpg','纸本 \n设色 \n30.3×\n119.9厘米 \n明代\n/唐寅 \n台北故宫博物院 \n1360×\n5142像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('5872','岁寒三友图\n','nan','/picture/5872/5872_0.jpg','纸本 \n水墨 \n24.6×\n44.2厘米 \n明代\n/文徵明 \n台北故宫博物院 \n1999×\n3498像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('5876','莲藕净因图\n','nan','/picture/5876/5876_0.jpg','纸本 \n浅设色 \n56.5×\n132厘米 \n明代\n/文嘉 \n台北故宫博物院 \n1743×\n4011像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('5906','花鸟轴\n','nan','/picture/5906/5906_0.jpg','花鸟轴\n绢本 \n设色 \n81.6×\n166.8厘米 \n明代\n/王谷祥 \n台北故宫博物院 \n1860×\n3759像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('5977','菊花竹石图\n','nan','/picture/5977/5977_0.jpg','纸本 \n水墨 \n33.9×\n52.2厘米 \n明代\n/项圣谟 \n台北故宫博物院 \n2048×\n3414像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei'),('598','猿图\n','nan','/picture/598/598_0.jpg','绢本 \n浅设色 \n67×\n131.8厘米 \n元代\n/颜辉 \n台北故宫博物院 \n1901×\n3678像素','nan','nan','nan','nan','nan','nan','nan','nan','nan','台北故宫博物院 ','The National Palace Museum in Taipei');
/*!40000 ALTER TABLE `paintings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-04 14:25:36
