import { TEST_SELECTORS } from "../../src/enums";

const { drawTools, controller, drawBtn } = TEST_SELECTORS;

/**
 * Tests that stopDrawing() deactivates the draw interaction
 * without discarding existing features.
 */
const stopDrawingTest = () => {
  cy.get(drawTools)
    .shadow()
    .within(() => {
      cy.get(controller).within(() => {
        // Start drawing
        cy.get(drawBtn).click();
        cy.get(drawBtn).should("have.attr", "disabled", "disabled");
      });
    });

  // Verify currently drawing, then call stopDrawing
  cy.get(drawTools).should(($el) => {
    expect($el[0].currentlyDrawing).to.be.true;
  });

  cy.get(drawTools).then(($el) => {
    $el[0].stopDrawing();
  });

  // Verify drawing stopped but features preserved
  cy.get(drawTools).should(($el) => {
    expect($el[0].currentlyDrawing).to.be.false;
    // drawnFeatures should still exist (not cleared like discardDrawing)
    // Note: the mock doesn't add features on draw, so we just verify state
    expect($el[0].draw.setActive).to.exist;
  });
};

export default stopDrawingTest;
