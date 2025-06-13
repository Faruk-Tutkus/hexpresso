const getTimeBasedGreeting = (): string => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return "Günaydın";
    } else if (currentHour >= 12 && currentHour < 17) {
        return "Tünaydın";
    } else if (currentHour >= 17 && currentHour < 22) {
        return "İyi akşamlar";
    } else {
        return "İyi geceler";
    }
};

export default getTimeBasedGreeting;