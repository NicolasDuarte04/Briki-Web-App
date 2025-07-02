const { detectInsuranceCategory, analyzeContextNeeds, hasSufficientContext, canShowPlans } = require('./shared/context-utils');

console.log('Testing Context Analysis Changes\n');
console.log('=' .repeat(50));

// Test case 1: Pet insurance without age
console.log('\n1. Pet Test - No Age:');
const petNoAge = "Acabo de comprar un perro";
const petCat1 = detectInsuranceCategory(petNoAge);
const petCtx1 = analyzeContextNeeds(petNoAge, petCat1);
console.log(`Message: "${petNoAge}"`);
console.log(`Category: ${petCat1}`);
console.log(`Needs More Context: ${petCtx1.needsMoreContext}`);
console.log(`Missing Info: ${petCtx1.missingInfo.join(', ')}`);
console.log(`Can Show Plans: ${canShowPlans(petCtx1, [])}`);

// Test case 2: Pet insurance with age
console.log('\n2. Pet Test - With Age:');
const petWithAge = "Acabo de comprar un perro de 2 años";
const petCat2 = detectInsuranceCategory(petWithAge);
const petCtx2 = analyzeContextNeeds(petWithAge, petCat2);
console.log(`Message: "${petWithAge}"`);
console.log(`Category: ${petCat2}`);
console.log(`Needs More Context: ${petCtx2.needsMoreContext}`);
console.log(`Missing Info: ${petCtx2.missingInfo.join(', ')}`);
console.log(`Can Show Plans: ${canShowPlans(petCtx2, [{id: 1}])}`);

// Test case 3: Auto insurance without details
console.log('\n3. Auto Test - No Details:');
const autoNoDetails = "Acabo de comprar un carro";
const autoCat1 = detectInsuranceCategory(autoNoDetails);
const autoCtx1 = analyzeContextNeeds(autoNoDetails, autoCat1);
console.log(`Message: "${autoNoDetails}"`);
console.log(`Category: ${autoCat1}`);
console.log(`Needs More Context: ${autoCtx1.needsMoreContext}`);
console.log(`Missing Info: ${autoCtx1.missingInfo.join(', ')}`);
console.log(`Can Show Plans: ${canShowPlans(autoCtx1, [])}`);

// Test case 4: Auto insurance with brand
console.log('\n4. Auto Test - With Brand:');
const autoWithBrand = "Acabo de comprar un Mazda 2024";
const autoCat2 = detectInsuranceCategory(autoWithBrand);
const autoCtx2 = analyzeContextNeeds(autoWithBrand, autoCat2);
console.log(`Message: "${autoWithBrand}"`);
console.log(`Category: ${autoCat2}`);
console.log(`Needs More Context: ${autoCtx2.needsMoreContext}`);
console.log(`Missing Info: ${autoCtx2.missingInfo.join(', ')}`);
console.log(`Can Show Plans: ${canShowPlans(autoCtx2, [{id: 1}])}`);

// Test case 5: Just "asegurar mi carro" - should require more context now
console.log('\n5. Auto Test - Generic Intent:');
const autoGeneric = "Quiero asegurar mi carro";
const autoCat3 = detectInsuranceCategory(autoGeneric);
const autoCtx3 = analyzeContextNeeds(autoGeneric, autoCat3);
console.log(`Message: "${autoGeneric}"`);
console.log(`Category: ${autoCat3}`);
console.log(`Needs More Context: ${autoCtx3.needsMoreContext}`);
console.log(`Missing Info: ${autoCtx3.missingInfo.join(', ')}`);
console.log(`Can Show Plans: ${canShowPlans(autoCtx3, [{id: 1}])}`);

// Test case 6: Pet with breed
console.log('\n6. Pet Test - With Breed:');
const petWithBreed = "Mi golden retriever de 3 años necesita seguro";
const petCat3 = detectInsuranceCategory(petWithBreed);
const petCtx3 = analyzeContextNeeds(petWithBreed, petCat3);
console.log(`Message: "${petWithBreed}"`);
console.log(`Category: ${petCat3}`);
console.log(`Needs More Context: ${petCtx3.needsMoreContext}`);
console.log(`Missing Info: ${petCtx3.missingInfo.join(', ')}`);
console.log(`Can Show Plans: ${canShowPlans(petCtx3, [{id: 1}])}`);

console.log('\n' + '=' .repeat(50)); 