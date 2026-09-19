/** @format */

class CharacterModel {
  constructor(
    characterId,
    characterName,
    description,
    image,
    passiveSkills,
    voice,
  ) {
    this.characterId = characterId;
    this.characterName = characterName;
    this.description = description;
    this.image = image;
    this.passiveSkills = passiveSkills;
    this.voice = voice;
  }
}

export default CharacterModel;
