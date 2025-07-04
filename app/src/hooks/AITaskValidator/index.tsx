import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { useState } from 'react';

export interface TaskValidationResult {
	isDone: boolean;
}

export interface AIValidationResponse {
	success: boolean;
	result?: TaskValidationResult;
	error?: string;
}

const useAITaskValidator = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Google AI Client
	const ai = new GoogleGenerativeAI("AIzaSyBeAM7n8yGpXmNJfDL7WkUcC09m0fKEQNo");

	const validateTask = async (
		imageBase64: string,
		taskType: 'instagram_follow' | 'twitter_follow' | 'facebook_share' | 'instagram_story' | 'twitter_tweet',
		taskDescription: string
	): Promise<AIValidationResponse> => {
		try {
			setLoading(true);
			setError(null);

			const model = ai.getGenerativeModel({
				model: "gemini-1.5-flash",
				generationConfig: {
					responseMimeType: 'application/json',
					responseSchema: {
						type: SchemaType.OBJECT,
						properties: {
							isDone: {
								type: SchemaType.BOOLEAN
							}
						}
					}
				}
			});

			// Task tipine göre özelleştirilmiş talimatlar
			const getSystemInstruction = (taskType: string, description: string) => {
				const baseInstruction = `Sen bir sosyal medya görev doğrulama uzmanısın. Kullanıcının paylaştığı ekran görüntüsünü analiz ederek belirtilen görevi gerçekten yapıp yapmadığını kontrol edeceksin.

GÖREV: ${description}

`;

				switch (taskType) {
					case 'instagram_follow':
						return baseInstruction + `
KONTROL KRİTERLERİ:
- Ekran görüntüsü Instagram uygulamasından mı?
- Hexpresso App hesabının profil sayfası görünüyor mu?
- "Takip Ediliyor" veya "Following" butonu aktif mi?
- Hesap adı "hexpresso" veya benzeri görünüyor mu?

BAŞARILI DURUMLAR:
✅ Instagram'da Hexpresso profilinde "Following" durumu
✅ Takip listesinde Hexpresso hesabı görünüyor
✅ Hexpresso profilinde takip butonu "Takip Ediliyor" olarak gözükuyor

BAŞARISIZ DURUMLAR:
❌ Farklı bir sosyal medya platformu
❌ Yanlış hesap takip edilmiş
❌ Takip butonu hala "Takip Et" olarak gözükuyor
❌ İlgisiz ekran görüntüsü`;

					case 'twitter_follow':
						return baseInstruction + `
KONTROL KRİTERLERİ:
- Ekran görüntüsü Twitter/X uygulamasından mı?
- Hexpresso hesabının profil sayfası görünüyor mu?
- "Takip Ediliyor" veya "Following" butonu aktif mi?
- Hesap adı "@hexpresso" veya benzeri görünüyor mu?

BAŞARILI DURUMLAR:
✅ Twitter'da Hexpresso profilinde "Following" durumu
✅ Takip listesinde Hexpresso hesabı görünüyor
✅ Hexpresso profilinde takip butonu aktif

BAŞARISIZ DURUMLAR:
❌ Farklı bir sosyal medya platformu
❌ Yanlış hesap takip edilmiş
❌ Takip butonu hala "Takip Et" olarak gözükuyor`;

					case 'facebook_share':
						return baseInstruction + `
KONTROL KRİTERLERİ:
- Ekran görüntüsü Facebook uygulamasından mı?
- Hexpresso hakkında bir paylaşım yapılmış mı?
- Paylaşım metni Hexpresso'dan bahsediyor mu?
- Paylaşım başarılı bir şekilde yayınlanmış mı?

BAŞARILI DURUMLAR:
✅ Facebook'ta Hexpresso linkini paylaşmış
✅ Hexpresso hakkında yazı paylaşmış
✅ "Paylaşıldı" veya benzeri başarı mesajı görünüyor

BAŞARISIZ DURUMLAR:
❌ Farklı bir platform kullanılmış
❌ İlgisiz içerik paylaşılmış
❌ Paylaşım taslak halinde kalmış`;

					case 'instagram_story':
						return baseInstruction + `
KONTROL KRİTERLERİ:
- Ekran görüntüsü Instagram story'den mi?
- Hexpresso logosu veya görseli story'de görünüyor mu?
- Story aktif olarak yayınlanmış mı?
- Hexpresso ile ilgili içerik var mı?

BAŞARILI DURUMLAR:
✅ Instagram story'de Hexpresso görseli paylaşılmış
✅ Story görüntüleyici sayısı görünüyor (yayınlandığını gösterir)
✅ Hexpresso logosu veya uygulaması story'de görünüyor

BAŞARISIZ DURUMLAR:
❌ Story taslak halinde
❌ Yanlış görsel paylaşılmış
❌ İlgisiz içerik`;

					case 'twitter_tweet':
						return baseInstruction + `
KONTROL KRİTERLERİ:
- Ekran görüntüsü Twitter/X uygulamasından mı?
- Hexpresso hakkında tweet atılmış mı?
- Tweet yayınlanmış mı (taslak değil)?
- #Hexpresso hashtagi kullanılmış mı?

BAŞARILI DURUMLAR:
✅ Twitter'da Hexpresso hakkında tweet atılmış
✅ Tweet yayınlanmış ve aktif
✅ Hexpresso ile ilgili hashtagler kullanılmış
✅ "Tweet gönderildi" mesajı görünüyor

BAŞARISIZ DURUMLAR:
❌ Tweet taslak halinde
❌ İlgisiz içerik
❌ Yanlış hashtagler`;

					default:
						return baseInstruction + `
Genel olarak kullanıcının verilen görevi tamamlayıp tamamlamadığını kontrol et.`;
				}
			};

			const systemInstruction = getSystemInstruction(taskType, taskDescription);

			const imageData = {
				inlineData: {
					data: imageBase64,
					mimeType: "image/jpeg"
				}
			};

			const result = await model.generateContent([
				systemInstruction,
				imageData
			]);

			const response = await result.response;
			const text = response.text();

			try {
				const validationResult: TaskValidationResult = JSON.parse(text);
				return {
					success: true,
					result: validationResult
				};
			} catch (parseError) {
				console.error('JSON parse error:', parseError);
				return {
					success: false,
					error: 'AI yanıtı işlenirken hata oluştu'
				};
			}

		} catch (err: any) {
			console.error('AI validation error:', err);
			const errorMessage = err.message || 'AI doğrulama sırasında hata oluştu';
			setError(errorMessage);

			return {
				success: false,
				error: errorMessage
			};
		} finally {
			setLoading(false);
		}
	};

	return {
		validateTask,
		loading,
		error
	};
};

export default useAITaskValidator; 