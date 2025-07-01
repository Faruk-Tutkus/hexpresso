import Icon from '@assets/icons';
import { CustomButton } from '@components';
import { Seer } from '@hooks';
import { useTheme, useToast } from '@providers';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { memo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
	FadeIn,
	FadeInDown,
	FadeOut,
	LayoutAnimationConfig,
	SlideInDown,
	ZoomIn
} from 'react-native-reanimated';
import styles from './styles';

interface SeerCardProps {
	seer: Seer;
	isExpanded: boolean;
	onPress: () => void;
}

interface FortuneWithCoin {
	fortune: string;
	coin: number;
	icon: string;
}

const getFortuneIcon = (fortune: string): string => {
	switch (fortune.toLowerCase()) {
		case 'kahve falı':
			return 'cafe-outline';
		case 'tarot':
		case 'tarot falı':
			return 'cards-playing-outline';
		case 'el falı':
			return 'hand-left-outline';
		case 'rüya yorumu':
			return 'moon-outline';
		default:
			return 'sparkles-outline';
	}
};

const getCoinIcon = (coin: number): string => {
	if (coin >= 500) return 'diamond-outline';
	if (coin >= 200) return 'trophy-outline';
	if (coin >= 150) return 'medal-outline';
	if (coin >= 100) return 'cash-outline';
	return 'logo-bitcoin';
};

// Fortune ve coin'leri eşleştiren fonksiyon
const createFortunesWithCoins = (fortunes: string[], coins: number[]): FortuneWithCoin[] => {
	return fortunes.map((fortune, index) => ({
		fortune,
		coin: coins[index] || coins[0], // Eğer coin sayısı az ise ilkini kullan
		icon: getFortuneIcon(fortune)
	}));
};

const SeerCard: React.FC<SeerCardProps> = memo(({ seer, isExpanded, onPress }) => {
	const { colors } = useTheme();
	const { showToast } = useToast();
	const [selectedFortuneWithCoin, setSelectedFortuneWithCoin] = useState<FortuneWithCoin | null>(null);

	// Fortune ve coin'leri birleştir
	const fortunesWithCoins = createFortunesWithCoins(seer.fortunes, seer.coins);

	const handleCardPress = () => {
		onPress();
	};

	const handleFortuneSelection = (fortuneWithCoin: FortuneWithCoin) => {
		setSelectedFortuneWithCoin(
			selectedFortuneWithCoin?.fortune === fortuneWithCoin.fortune ? null : fortuneWithCoin
		);
	};

	const handleFalBaktir = () => {
		if (!selectedFortuneWithCoin) {
			showToast('Lütfen bir fal türü seçiniz', 'error');
			return;
		};

		const seerDataParam = encodeURIComponent(JSON.stringify(seer));
		let routePath = '';

		switch (selectedFortuneWithCoin.fortune.toLowerCase()) {
			case 'kahve falı':
				routePath = `/src/screens/main/navigator/FortuneScreens/CoffeeFortune?seerData=${seerDataParam}`;
				break;
			case 'el falı':
				routePath = `/src/screens/main/navigator/FortuneScreens/HandFortune?seerData=${seerDataParam}`;
				break;
			case 'rüya yorumu':
				routePath = `/src/screens/main/navigator/FortuneScreens/DreamFortune?seerData=${seerDataParam}`;
				break;
			case 'tarot':
			case 'tarot falı':
				routePath = `/src/screens/main/navigator/FortuneScreens/CoffeeFortune?seerData=${seerDataParam}`;
				break;
			default:
				showToast('Bu fal türü henüz desteklenmiyor', 'error');
				return;
		}

		router.push(routePath as any);
	};

	return (
		<LayoutAnimationConfig skipEntering>
			<Animated.View
				style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
				entering={FadeIn.duration(600).springify()}
			>
				{/* Card Header */}
				<TouchableOpacity
					style={styles.cardHeader}
					onPress={handleCardPress}
					activeOpacity={0.8}
				>
					{isExpanded ? (
						// Expanded Layout: Centered image with info below
						<View style={styles.expandedHeaderLayout}>
							<Animated.View
								style={[styles.profileImageContainerExpanded, { borderColor: colors.primary }]}
								entering={ZoomIn.delay(200).springify()}
							>
								<Image
									source={{ uri: seer.url }}
									style={styles.profileImageExpanded}
									contentFit="cover"
									placeholder="🔮"
									transition={300}
								/>
							</Animated.View>

							<Animated.View
								style={styles.expandedProfileInfo}
								entering={SlideInDown.delay(300).springify()}
							>
								<Text style={[styles.seerName, { color: colors.text, textAlign: 'center' }]}>
									{seer.name}
								</Text>
								<Text style={[styles.seerInfoExpanded, { color: colors.secondaryText }]}>
									{seer.info}
								</Text>
								<View style={styles.responseTimeContainer}>
									<View style={styles.responseTimeIcon}>
										<Icon
											name="flash-outline"
											size={14}
											color={colors.primary}
										/>
									</View>
									<Text style={[styles.responseTime, { color: colors.secondaryText }]}>
										{seer.responsetime} dakika yanıt
									</Text>
								</View>
							</Animated.View>

							<Animated.View
								style={[styles.expandButton, styles.expandButtonExpanded, { backgroundColor: colors.secondaryText }]}
								entering={FadeIn.delay(400)}
							>
								<Icon
									name="chevron-up"
									size={20}
									color={colors.background}
								/>
							</Animated.View>
						</View>
					) : (
						// Collapsed Layout: Side by side
						<View style={styles.profileSection}>
							<Animated.View
								style={[styles.profileImageContainer, { borderColor: colors.primary }]}
								entering={ZoomIn.delay(200).springify()}
							>
								<Image
									source={{ uri: seer.url }}
									style={styles.profileImage}
									contentFit="cover"
									placeholder="🔮"
									transition={300}
								/>
							</Animated.View>

							<Animated.View
								style={styles.profileInfo}
								entering={SlideInDown.delay(300).springify()}
							>
								<Text style={[styles.seerName, { color: colors.text }]}>
									{seer.name}
								</Text>
								<Text style={[styles.seerInfo, { color: colors.secondaryText }]} numberOfLines={2}>
									{seer.info}
								</Text>
								<View style={styles.responseTimeContainer}>
									<View style={styles.responseTimeIcon}>
										<Icon
											name="flash-outline"
											size={14}
											color={colors.primary}
										/>
									</View>
									<Text style={[styles.responseTime, { color: colors.secondaryText }]}>
										{seer.responsetime} dakika yanıt
									</Text>
								</View>
							</Animated.View>

							<Animated.View
								style={[styles.expandButton, { backgroundColor: colors.secondaryText }]}
								entering={FadeIn.delay(400)}
							>
								<Icon
									name="chevron-down"
									size={20}
									color={colors.background}
								/>
							</Animated.View>
						</View>
					)}
				</TouchableOpacity>

				{/* Expanded Content */}
				{isExpanded && (
					<Animated.View
						style={styles.expandedContent}
						entering={FadeInDown.duration(400).springify()}
						exiting={FadeOut.duration(200)}
					>
						<View style={[styles.divider, { backgroundColor: colors.border }]} />

						{/* Character Description */}
						<Animated.View
							style={styles.section}
							entering={FadeInDown.delay(100).springify()}
						>
							<View style={styles.sectionHeader}>
								<Icon name="sparkles-outline" size={18} color={colors.primary} />
								<Text style={[styles.sectionTitle, { color: colors.primary }]}>
									Karakter
								</Text>
							</View>
							<Text style={[styles.characterText, { color: colors.text }]}>
								{seer.character}
							</Text>
						</Animated.View>

						{/* Life Story */}
						<Animated.View
							style={styles.section}
							entering={FadeInDown.delay(150).springify()}
						>
							<View style={styles.sectionHeader}>
								<Icon name="book-outline" size={18} color={colors.primary} />
								<Text style={[styles.sectionTitle, { color: colors.primary }]}>
									Hikayesi
								</Text>
							</View>
							<Text style={[styles.lifestoryText, { color: colors.secondaryText }]}>
								{seer.lifestory}
							</Text>
						</Animated.View>

						{/* Note */}
						<Animated.View
							style={[styles.noteContainer, { backgroundColor: colors.background, borderColor: colors.border }]}
							entering={FadeInDown.delay(200).springify()}
						>
							<View style={styles.quoteIcon}>
								<Icon name="book" size={16} color={colors.primary} />
							</View>
							<Text style={[styles.noteText, { color: colors.text }]}>
								{seer.note}
							</Text>
						</Animated.View>

						{/* Experience */}
						<Animated.View
							style={styles.section}
							entering={FadeInDown.delay(250).springify()}
						>
							<View style={styles.sectionHeader}>
								<Icon name="trophy-outline" size={18} color={colors.primary} />
								<Text style={[styles.sectionTitle, { color: colors.primary }]}>
									Deneyimleri
								</Text>
							</View>
							<View style={[styles.experienceGrid]}>
								{seer.experience.map((exp, index) => (
									<Animated.View
										key={index}
										style={[styles.experienceItem, { backgroundColor: colors.background, borderColor: colors.border }]}
										entering={FadeIn.delay(300 + index * 50).springify()}
									>
										<Icon name="checkmark-circle-outline" size={16} color={colors.secondary} />
										<Text style={[styles.experienceText, { color: colors.text }]}>
											{exp}
										</Text>
									</Animated.View>
								))}
							</View>
						</Animated.View>

						{/* Fortune Types with Coins */}
						<Animated.View
							style={styles.section}
							entering={FadeInDown.delay(350).springify()}
						>
							<View style={styles.sectionHeader}>
								<Icon name="crystal-ball" size={18} color={colors.primary} zodiac />
								<Text style={[styles.sectionTitle, { color: colors.primary }]}>
									Fal Türleri & Ücretler
								</Text>
							</View>
							<View style={styles.fortuneGrid}>
								{fortunesWithCoins.map((item, index) => (
									<Animated.View
										key={`${item.fortune}-${item.coin}`}
										entering={FadeIn.delay(400 + index * 50).springify()}
									>
										<TouchableOpacity
											style={[
												styles.fortuneButton,
												{
													backgroundColor: selectedFortuneWithCoin?.fortune === item.fortune
														? colors.primary
														: colors.background,
													borderColor: selectedFortuneWithCoin?.fortune === item.fortune
														? colors.primary
														: colors.border
												}
											]}
											onPress={() => handleFortuneSelection(item)}
											activeOpacity={0.8}
										>
											<View style={styles.fortuneButtonContent}>
												<View style={styles.fortuneInfo}>
													<Icon
														name={item.icon}
														size={16}
														color={selectedFortuneWithCoin?.fortune === item.fortune
															? colors.background
															: colors.text
														}
														zodiac={item.icon === 'cards-playing-outline' ? true : false}
													/>
													<Text style={[
														styles.fortuneButtonText,
														{
															color: selectedFortuneWithCoin?.fortune === item.fortune
																? colors.background
																: colors.text
														}
													]}
														numberOfLines={2}
													>
														{item.fortune}
													</Text>
												</View>
												<View style={styles.coinInfo}>
													<Icon
														name={getCoinIcon(item.coin)}
														size={14}
														color={selectedFortuneWithCoin?.fortune === item.fortune
															? colors.background
															: colors.secondary
														}
													/>
													<Text style={[
														styles.coinText,
														{
															color: selectedFortuneWithCoin?.fortune === item.fortune
																? colors.background
																: colors.secondary
														}
													]}>
														{item.coin}
													</Text>
												</View>
											</View>
										</TouchableOpacity>
									</Animated.View>
								))}
							</View>
						</Animated.View>

						{/* Action Button */}
						<Animated.View
							style={[styles.actionSection, { borderColor: colors.border }]}
							entering={FadeInDown.delay(550).springify()}
						>
							<CustomButton
								title="🔮 Fal Baktır"
								onPress={handleFalBaktir}
								//disabled={!selectedFortuneWithCoin}
								variant={selectedFortuneWithCoin ? "primary" : "secondary"}
								contentStyle={[
									styles.actionButton,
									{
										opacity: selectedFortuneWithCoin ? 1 : 0.5,
										backgroundColor: selectedFortuneWithCoin ? colors.primary : colors.border
									}
								]}
							/>
						</Animated.View>
					</Animated.View>
				)}
			</Animated.View>
		</LayoutAnimationConfig>
	);
});

export default SeerCard; 