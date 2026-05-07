import { TEST_SELECTORS } from "../../src/enums";
const { drawTools } = TEST_SELECTORS;

/**
 * Tests that programmatic mutations of drawnFeatures do NOT fire
 * the `drawupdate` event. The caller initiated the change, so a
 * callback would be a feedback loop — `drawupdate` is reserved for
 * user-initiated draw / modify / discard actions.
 */
const programmaticNoEmitTest = () => {
  cy.get(drawTools).then(([$el]) => {
    const mockFeature = (id) => {
      const feature = {
        id,
        getGeometry: () => ({ transform: () => {} }),
        clone: () => feature,
        setGeometry: () => {},
      };
      return feature;
    };

    const stub = cy.stub();
    $el.addEventListener("drawupdate", stub);

    // Assigning the property
    $el.drawnFeatures = [mockFeature("a"), mockFeature("b"), mockFeature("c")];

    // Removing by index
    $el.removeFeatureByIndex(1);

    // Removing by feature reference
    const remaining = $el.drawnFeatures;
    $el.removeFeature(remaining[0]);

    // Wait one tick to flush any setTimeout(0) inside emit, then assert silence
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(50).then(() => {
      expect(stub).to.have.callCount(0);
      expect($el.drawnFeatures.length).to.equal(1);
    });
  });
};

export default programmaticNoEmitTest;
