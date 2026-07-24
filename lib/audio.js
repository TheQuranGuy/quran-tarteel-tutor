export const reciters = { alafasy: "Alafasy", husary: "Al-Husary", abdulbasit: "Abdul Basit" };
const source = { alafasy: "ar.alafasy", husary: "ar.husary", abdulbasit: "ar.abdulbasitmurattal" };
export function getAudioUrl(reciter, ayah) {
  const ayahFile = String(ayah).padStart(6, "0");
  if (reciter === "abdulbasit") return `https://verses.quran.foundation/AbdulBaset/Mujawwad/mp3/${ayahFile}.mp3`;
  return `https://cdn.islamic.network/quran/audio/128/${source[reciter] || source.alafasy}/${ayah}.mp3`;
}
