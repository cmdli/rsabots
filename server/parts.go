package main

type Anchor struct {
	x,y int32
	zDelta int32
}

type AnchoredPart struct {
	anchor Anchor
	part *PartData
}

type PartData struct {
	imagePath string
	width uint32
	height uint32
	socket Anchor
	subparts []AnchoredPart
	flipX bool
	flipY bool
}

func (part *PartData) clone() *PartData {
	newSubparts := make([]AnchoredPart, len(part.subparts))
	copy(newSubparts, part.subparts)
	newPart := PartData{
		part.imagePath, 
		part.width, 
		part.height, 
		part.socket, 
		newSubparts, 
		part.flipX, 
		part.flipY,
	}
	return &newPart
}

func (ancestorPart *PartData) addSubpart(anchor Anchor, part *PartData) {
	ancestorPart.subparts = append(ancestorPart.subparts, AnchoredPart{anchor, part})
}

func (part *PartData) flipHorizontal() *PartData {
	newPart := part.clone()
	newPart.socket.x = 1.0 - newPart.socket.x
	newPart.flipX = !newPart.flipX
	return newPart
}

func (part *PartData) flipVertical() *PartData {
	newPart := part.clone()
	newPart.socket.y = 1.0 - newPart.socket.y
	newPart.flipY = !newPart.flipY
	return newPart
}

type AnchoredPattern struct {
	anchor Anchor
	pattern *Pattern
}

type ChoiceResult []AnchoredPattern
type ChoiceSelection []ChoiceResult

type Pattern struct {
	basePattern *PartData
	choices []ChoiceSelection
}

func (p *Pattern) addChoice(anchors []Anchor, patterns [][]*Pattern) {
	choice := make(ChoiceSelection, 0)
	for _, choicePatterns := range patterns {
		result := make(ChoiceResult, 0)
		for i := range anchors {
			anchor := anchors[i]
			pattern := choicePatterns[i]
			result = append(result, AnchoredPattern{anchor, pattern})
		}
		choice = append(choice, result)
	}
	p.choices = append(p.choices, choice)
}