import { TEST_SELECTORS } from "../../src/enums";

const { drawTools } = TEST_SELECTORS;

/**
 * Tests that removeFeatureByIndex removes a feature from the draw layer
 * and emits a drawupdate event.
 */
const removeFeatureByIndexTest = () => {
  // Set up event listener stub
  cy.get(drawTools).then(($el) => {
    $el[0].addEventListener("drawupdate", cy.stub().as("drawUpdateStub"));
  });

  // The mock map starts with 2 features in the source
  // removeFeatureByIndex should remove one and emit drawupdate
  cy.get(drawTools).then(($el) => {
    const result = $el[0].removeFeatureByIndex(0);
    expect(result).to.be.true;
  });

  // Wait for the setTimeout(0) in emitDrawnFeatures
  cy.wait(50);

  // Verify drawupdate was fired
  cy.get("@drawUpdateStub").should("be.called");

  // Test out-of-bounds returns false
  cy.get(drawTools).then(($el) => {
    expect($el[0].removeFeatureByIndex(-1)).to.be.false;
    expect($el[0].removeFeatureByIndex(999)).to.be.false;
  });
};

export default removeFeatureByIndexTest;
