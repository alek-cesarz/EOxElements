import { TEST_SELECTORS } from "../../src/enums";
const { drawTools } = TEST_SELECTORS;

/**
 * Tests that stopDrawing() deactivates the draw interaction
 * without discarding existing features (unlike discardDrawing()).
 */
const stopDrawingTest = () => {
  // Start drawing
  cy.get(drawTools).shadow().find('[data-cy="drawBtn"]').click();
  cy.get(drawTools).should(([$el]) => {
    expect($el.currentlyDrawing).to.be.true;
  });

  // Seed a feature so we can verify it's preserved
  cy.get(drawTools).then(([$el]) => {
    const mockFeature = {
      getGeometry: () => ({ transform: () => {} }),
      clone: () => mockFeature,
      setGeometry: () => {},
    };
    $el.drawnFeatures = [mockFeature];
    expect($el.drawnFeatures.length).to.equal(1);
  });

  // Stop drawing programmatically
  cy.get(drawTools).then(([$el]) => {
    $el.stopDrawing();
  });

  // Drawing must be off, features must be preserved
  cy.get(drawTools).should(([$el]) => {
    expect($el.currentlyDrawing).to.be.false;
    expect($el.drawnFeatures.length).to.equal(1);
    expect($el.drawLayer.get("isDrawingEnabled")).to.equal(false);
  });
};

export default stopDrawingTest;
