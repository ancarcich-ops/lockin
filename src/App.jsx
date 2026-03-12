import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Heart, X, Wand2, Clock, Archive, ShoppingCart, Plus, LogOut, User, Camera, Edit2, Check } from 'lucide-react';

const supabase = createClient(
  'https://vftxreojulwfqzguylrk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmdHhyZW9qdWx3ZnF6Z3V5bHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTIxOTUsImV4cCI6MjA4Njg2ODE5NX0.s-409NS9X6yvpCulKqM45tfl74EsVbuJSDYi9Ln4qCI'
);

const sampleRecipes = [
  // ── ORIGINALS ──
  { id: 1, name: "Mediterranean Quinoa Bowl", author: "You", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", prepTime: "20 min", cookTime: 15, servings: 4, ingredients: ["1 cup quinoa","2 cups water","2 cups cherry tomatoes","1 large cucumber, diced","1 cup feta cheese","1/2 cup kalamata olives","2 lemons (juice)","1/4 cup olive oil","Salt and pepper","Fresh parsley"], instructions: ["Rinse quinoa, combine with water and bring to boil.","Reduce heat, cover, simmer 15 minutes. Fluff and cool.","Prepare vegetables while quinoa cooks.","Combine all ingredients in a bowl.","Whisk lemon juice, olive oil, salt and pepper.","Pour dressing over and toss.","Garnish with parsley and serve."], tags: ["Healthy","Quick","Vegetarian","Lunch","Whole30"], timesMade: 5, isEasy: true },
  { id: 2, name: "Teriyaki Chicken Stir Fry", author: "You", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop", prepTime: "30 min", cookTime: 25, servings: 4, ingredients: ["1.5 lbs chicken breast","3 cups broccoli florets","2 bell peppers, sliced","1/4 cup soy sauce","3 tbsp honey","2 tbsp fresh ginger","3 cloves garlic","2 cups jasmine rice","2 tbsp vegetable oil","Sesame seeds"], instructions: ["Cook rice and set aside.","Mix soy sauce, honey, ginger and garlic for sauce.","Cook chicken in oil until golden, remove.","Stir-fry broccoli and peppers 4-5 minutes.","Return chicken, pour sauce over everything.","Stir until sauce thickens. Serve over rice."], tags: ["Asian","Protein","Dinner","KidFriendly","QuickWeeknight"], timesMade: 3, isEasy: false },
  { id: 3, name: "Creamy Tomato Pasta", author: "You", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop", prepTime: "25 min", cookTime: 20, servings: 4, ingredients: ["1 lb penne pasta","2 lbs fresh tomatoes","1 cup heavy cream","4 cloves garlic","1/4 cup fresh basil","1/2 cup parmesan","3 tbsp olive oil","Salt and pepper"], instructions: ["Cook pasta, reserve 1 cup pasta water, drain.","Saute garlic in olive oil 1 minute.","Add tomatoes, simmer 10-12 minutes.","Stir in heavy cream.","Toss with pasta, add pasta water as needed.","Top with basil and parmesan."], tags: ["Comfort Food","Italian","Dinner","HouseFavorites"], timesMade: 0, isEasy: false },
  { id: 4, name: "Quick Avocado Toast", author: "You", image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400&h=300&fit=crop", prepTime: "10 min", cookTime: 5, servings: 2, ingredients: ["4 slices sourdough bread","2 ripe avocados","1 lemon (juice)","1/2 tsp salt","1/4 tsp black pepper","1 cup cherry tomatoes","Red pepper flakes"], instructions: ["Toast bread until golden.","Mash avocados with lemon juice, salt and pepper.","Spread avocado on toast.","Top with cherry tomatoes.","Sprinkle with red pepper flakes if desired."], tags: ["Quick","Breakfast","Healthy","Whole30"], timesMade: 8, isEasy: true },
  { id: 5, name: "Simple Greek Salad", author: "You", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop", prepTime: "15 min", cookTime: 0, servings: 4, ingredients: ["2 large cucumbers","4 medium tomatoes","1 red onion","1 cup feta cheese","1/2 cup kalamata olives","1/4 cup olive oil","2 tbsp red wine vinegar","1 tsp oregano","Salt and pepper"], instructions: ["Wash and dry all vegetables.","Cut cucumbers and tomatoes into pieces.","Combine in bowl with onion.","Add feta and olives.","Whisk dressing and pour over. Toss."], tags: ["Quick","Healthy","Vegetarian","Lunch","Whole30"], timesMade: 0, isEasy: true },
  { id: 6, name: "Garlic Shrimp Pasta", author: "You", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop", prepTime: "25 min", cookTime: 20, servings: 4, ingredients: ["1 lb spaghetti","1.5 lbs large shrimp","6 cloves garlic","1/2 cup white wine","4 tbsp butter","1/4 cup fresh parsley","1/4 cup parmesan","2 tbsp olive oil","1 tsp red pepper flakes","Zest of 1 lemon"], instructions: ["Cook spaghetti, reserve pasta water.","Cook shrimp 2 min per side. Remove.","Cook garlic in butter 1 minute.","Add wine and red pepper flakes. Simmer 3-4 min.","Return shrimp and pasta, toss to coat.","Stir in parsley, lemon zest and parmesan."], tags: ["Seafood","Italian","Dinner","DateNight","HouseFavorites"], timesMade: 0, isEasy: false },

  // ── TRENDING 2025 - QUICK WEEKNIGHT / HOUSE FAVORITES ──
  { id: 7, name: "Marry Me Chicken Pasta", author: "You", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop", prepTime: "25 min", cookTime: 20, servings: 4, ingredients: ["1.5 lbs chicken breast, sliced thin","12 oz penne pasta","1 cup heavy cream","1/2 cup sun-dried tomatoes","4 cloves garlic, minced","1/2 cup parmesan, grated","1 tsp red pepper flakes","1 tsp Italian seasoning","2 tbsp olive oil","Fresh basil to garnish"], instructions: ["Season chicken with salt, pepper and Italian seasoning.","Cook chicken in olive oil 4-5 min per side until golden. Set aside.","In same pan, cook garlic 1 min.","Add cream, sun-dried tomatoes and red pepper flakes. Simmer 3 min.","Stir in parmesan until melted.","Add cooked pasta and sliced chicken, toss to coat.","Garnish with fresh basil and serve immediately."], tags: ["Dinner","Italian","QuickWeeknight","HouseFavorites"], timesMade: 0, isEasy: false },
  { id: 8, name: "Honey Garlic Chicken Rice Bowl", author: "You", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop", prepTime: "20 min", cookTime: 20, servings: 4, ingredients: ["1.5 lbs chicken thighs, boneless","3 tbsp honey","4 cloves garlic, minced","3 tbsp soy sauce","1 tbsp rice vinegar","2 cups jasmine rice, cooked","1 cup broccoli florets, steamed","2 green onions, sliced","1 tbsp sesame seeds","1 tbsp vegetable oil"], instructions: ["Mix honey, garlic, soy sauce and rice vinegar for sauce.","Cook chicken thighs in oil 5-6 min per side until cooked through.","Pour sauce over chicken and simmer 2-3 min, coating well.","Slice chicken and serve over rice with broccoli.","Top with green onions and sesame seeds."], tags: ["Asian","Dinner","QuickWeeknight","KidFriendly","HouseFavorites"], timesMade: 0, isEasy: true },
  { id: 9, name: "One Pan Lemon Herb Salmon", author: "You", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop", prepTime: "10 min", cookTime: 15, servings: 4, ingredients: ["4 salmon fillets","1 lemon, sliced","4 cloves garlic, minced","2 tbsp olive oil","1 tsp dried dill","1 tsp smoked paprika","1 lb asparagus, trimmed","Salt and pepper","Fresh parsley"], instructions: ["Preheat oven to 400F. Line baking sheet with parchment.","Place salmon and asparagus on sheet pan.","Mix olive oil, garlic, dill and paprika. Brush over salmon.","Top with lemon slices. Season asparagus with oil, salt and pepper.","Bake 12-15 min until salmon flakes easily.","Garnish with fresh parsley and serve."], tags: ["Seafood","Healthy","Whole30","QuickWeeknight","DateNight"], timesMade: 0, isEasy: true },
  { id: 10, name: "Ground Turkey Taco Bowls", author: "You", image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&h=300&fit=crop", prepTime: "15 min", cookTime: 15, servings: 4, ingredients: ["1.5 lbs ground turkey","2 tbsp taco seasoning","2 cups cooked brown rice","1 can black beans, drained","1 cup corn","1 cup cherry tomatoes, halved","1 avocado, sliced","1/4 cup fresh cilantro","Lime wedges","Sour cream optional"], instructions: ["Brown turkey in skillet over medium-high heat, breaking up as it cooks.","Add taco seasoning and 1/4 cup water. Stir and simmer 3 min.","Warm beans and corn in a small saucepan.","Build bowls: rice, turkey, beans, corn, tomatoes.","Top with avocado, cilantro and a squeeze of lime."], tags: ["Mexican","Healthy","Dinner","KidFriendly","QuickWeeknight","Whole30"], timesMade: 0, isEasy: true },

  // ── CROCK POT FAVORITES ──
  { id: 11, name: "Crockpot Salsa Verde Chicken", author: "You", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop", prepTime: "10 min", cookTime: 240, servings: 6, ingredients: ["2 lbs chicken breast","1 jar (16 oz) salsa verde","1 can diced green chiles","1 tsp cumin","1 tsp garlic powder","1 tsp onion powder","Salt and pepper","Tortillas or rice to serve","Sour cream and cilantro to garnish"], instructions: ["Place chicken in crockpot. Season with cumin, garlic powder, onion powder, salt and pepper.","Pour salsa verde and green chiles over chicken.","Cook on low 6-7 hours or high 3-4 hours.","Shred chicken with two forks directly in the pot.","Stir chicken back into the juices.","Serve in tacos, bowls or over rice. Top with sour cream and cilantro."], tags: ["Mexican","CrockPot","Dinner","KidFriendly","HouseFavorites"], timesMade: 0, isEasy: true },
  { id: 12, name: "Slow Cooker Tuscan White Bean Soup", author: "You", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop", prepTime: "15 min", cookTime: 360, servings: 6, ingredients: ["2 cans white cannellini beans, drained","1 lb Italian sausage, sliced","1 can diced tomatoes","3 cups chicken broth","3 cups kale, chopped","4 cloves garlic, minced","1 onion, diced","1 tsp Italian seasoning","1/2 tsp red pepper flakes","Parmesan rind (optional)","Salt and pepper"], instructions: ["Add all ingredients except kale to crockpot.","Stir to combine. Drop in parmesan rind if using.","Cook on low 7-8 hours or high 4 hours.","In last 30 minutes, stir in kale and cook until wilted.","Remove parmesan rind. Taste and adjust seasoning.","Serve with crusty bread and extra parmesan."], tags: ["Soup","CrockPot","Dinner","HouseFavorites"], timesMade: 0, isEasy: true },
  { id: 13, name: "Crockpot Chicken Tikka Masala", author: "You", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop", prepTime: "15 min", cookTime: 300, servings: 5, ingredients: ["2 lbs chicken thighs, boneless, cubed","1 can (28oz) crushed tomatoes","1 can coconut milk","1 onion, diced","4 cloves garlic, minced","2 tbsp tikka masala spice blend","1 tsp garam masala","1 tsp ginger, grated","2 tbsp olive oil","Basmati rice and naan to serve","Fresh cilantro"], instructions: ["Saute onion and garlic in oil until soft. Transfer to crockpot.","Add chicken, tomatoes, coconut milk and all spices.","Stir to combine.","Cook on low 6-7 hours or high 3-4 hours.","Shred chicken slightly or leave in chunks.","Serve over basmati rice with naan and fresh cilantro."], tags: ["Indian","CrockPot","Dinner","HouseFavorites"], timesMade: 0, isEasy: true },
  { id: 14, name: "Slow Cooker Beef Chili", author: "You", image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop", prepTime: "20 min", cookTime: 480, servings: 8, ingredients: ["2 lbs ground beef","2 cans kidney beans, drained","1 can diced tomatoes","1 can tomato sauce","1 onion, diced","3 cloves garlic, minced","2 tbsp chili powder","1 tsp cumin","1 tsp smoked paprika","1/2 tsp cayenne (optional)","Salt and pepper","Toppings: cheese, sour cream, green onions"], instructions: ["Brown beef in skillet. Drain fat.","Add beef and all remaining ingredients to crockpot.","Stir to combine.","Cook on low 8 hours or high 4-5 hours.","Taste and adjust seasoning.","Serve with your favorite toppings."], tags: ["CrockPot","Dinner","KidFriendly","HouseFavorites"], timesMade: 0, isEasy: true },

  // ── KID FRIENDLY ──
  { id: 15, name: "Sheet Pan Mac and Cheese Bake", author: "You", image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&h=300&fit=crop", prepTime: "10 min", cookTime: 25, servings: 6, ingredients: ["1 lb elbow macaroni, cooked","2 cups sharp cheddar, shredded","1 cup gruyere, shredded","2 cups milk","3 tbsp butter","3 tbsp flour","1/2 tsp mustard powder","Salt and pepper","1/2 cup panko breadcrumbs"], instructions: ["Make roux: melt butter, whisk in flour, cook 1 min.","Slowly whisk in milk. Cook until thickened, 5 min.","Stir in cheese until melted. Season with mustard powder, salt and pepper.","Toss with cooked pasta. Pour into baking dish.","Top with breadcrumbs and extra cheese.","Bake at 375F for 20-25 min until golden and bubbly."], tags: ["Dinner","KidFriendly","Comfort Food","HouseFavorites"], timesMade: 0, isEasy: false },
  { id: 16, name: "Hidden Veggie Turkey Meatballs", author: "You", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop", prepTime: "20 min", cookTime: 20, servings: 5, ingredients: ["1.5 lbs ground turkey","1/2 cup zucchini, grated and squeezed dry","1/2 cup carrot, finely grated","1/4 cup parmesan","1 egg","3 cloves garlic, minced","1/2 cup breadcrumbs","1 tsp Italian seasoning","Salt and pepper","Marinara sauce to serve"], instructions: ["Preheat oven to 400F. Line baking sheet with parchment.","Combine all ingredients in a bowl. Mix gently until just combined.","Roll into 1.5 inch balls and place on baking sheet.","Bake 18-20 min until cooked through.","Warm marinara sauce and serve with pasta or as an appetizer.","Kids won't even notice the vegetables!"], tags: ["Dinner","KidFriendly","Healthy","Protein"], timesMade: 0, isEasy: false },

  // ── WHOLE 30 ──
  { id: 17, name: "Whole30 Sheet Pan Chicken and Veggies", author: "You", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop", prepTime: "15 min", cookTime: 35, servings: 4, ingredients: ["4 chicken thighs, bone-in","2 bell peppers, sliced","1 zucchini, sliced","1 red onion, wedges","1 cup cherry tomatoes","3 tbsp olive oil","4 cloves garlic, minced","1 tsp smoked paprika","1 tsp Italian seasoning","Salt and pepper","Fresh lemon wedges"], instructions: ["Preheat oven to 425F.","Toss vegetables with 2 tbsp olive oil, salt and pepper. Spread on sheet pan.","Rub chicken with remaining oil, garlic, paprika, Italian seasoning, salt and pepper.","Nestle chicken among vegetables on pan.","Roast 30-35 min until chicken is cooked through and vegetables are caramelized.","Squeeze fresh lemon over everything before serving."], tags: ["Whole30","Healthy","Dinner","QuickWeeknight"], timesMade: 0, isEasy: true },
  { id: 18, name: "Blackened Salmon with Mango Salsa", author: "You", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop", prepTime: "15 min", cookTime: 12, servings: 4, ingredients: ["4 salmon fillets","1 tbsp blackening seasoning","2 tbsp olive oil","1 ripe mango, diced","1/4 red onion, finely diced","1 jalapeno, seeded and minced","1/4 cup fresh cilantro","2 tbsp lime juice","Salt to taste"], instructions: ["Make mango salsa: combine mango, red onion, jalapeno, cilantro and lime juice. Season with salt.","Pat salmon dry. Coat all over with blackening seasoning.","Heat oil in cast iron skillet over high heat until very hot.","Cook salmon 4-5 min per side until blackened and cooked through.","Serve salmon topped generously with mango salsa."], tags: ["Whole30","Seafood","Healthy","DateNight","QuickWeeknight"], timesMade: 0, isEasy: true },

  // ── DATE NIGHT ──
  { id: 19, name: "Chicken in Creamy Mushroom Sauce", author: "You", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", prepTime: "15 min", cookTime: 25, servings: 2, ingredients: ["2 large chicken breasts","8 oz cremini mushrooms, sliced","3 cloves garlic, minced","1/2 cup white wine","1 cup heavy cream","2 tbsp butter","1 tbsp fresh thyme","1 tbsp Dijon mustard","Salt and pepper","Fresh parsley"], instructions: ["Season chicken generously with salt and pepper.","Sear chicken in butter 5-6 min per side until golden. Remove and set aside.","In same pan, cook mushrooms until browned, 5 min.","Add garlic and thyme, cook 1 min.","Deglaze with white wine. Simmer 2 min.","Stir in cream and Dijon. Simmer until thickened.","Return chicken to pan. Simmer 5 min until cooked through.","Garnish with fresh parsley and serve."], tags: ["Dinner","DateNight","HouseFavorites"], timesMade: 0, isEasy: false },
  { id: 20, name: "Seared Scallops with Lemon Butter", author: "You", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop", prepTime: "10 min", cookTime: 10, servings: 2, ingredients: ["1 lb large sea scallops","3 tbsp butter","2 cloves garlic, minced","1 lemon (juice and zest)","1 tbsp fresh parsley","Salt and pepper","1 tbsp olive oil","Cauliflower puree or risotto to serve"], instructions: ["Pat scallops completely dry with paper towels. Season generously with salt and pepper.","Heat oil in stainless or cast iron skillet over very high heat until smoking.","Add scallops without crowding. Do NOT move them. Sear 90 seconds.","Flip scallops. Add butter and garlic. Baste with butter 60-90 seconds.","Remove scallops. Add lemon juice to pan and swirl.","Plate scallops, drizzle with lemon butter, garnish with parsley and lemon zest."], tags: ["Seafood","DateNight","Healthy","Whole30"], timesMade: 0, isEasy: false }
];

const communityRecipes = [
  { id: 101, name: "Spicy Thai Basil Chicken", author: "Sarah Chen", avatar: "SC", image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop", prepTime: "25 min", cookTime: 25, likes: 24, onMenu: 8, saves: 15, isEasy: false, ingredients: ["1.5 lbs chicken","2 cups Thai basil","4 chilies","3 tbsp fish sauce","4 cloves garlic","2 tbsp soy sauce","1 tbsp oyster sauce","2 tbsp oil"], instructions: ["Heat oil in wok over high heat.","Add garlic and chilies, stir-fry 1 minute.","Add chicken, cook until done.","Add sauces, stir to combine.","Add basil and toss until wilted.","Serve over rice."], tags: ["Asian","Dinner"], servings: 4 },
  { id: 102, name: "Honey Garlic Salmon", author: "Marcus Johnson", avatar: "MJ", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop", prepTime: "20 min", cookTime: 15, likes: 31, onMenu: 12, saves: 22, isEasy: true, ingredients: ["4 salmon fillets","3 tbsp honey","4 cloves garlic","2 tbsp soy sauce","1 lemon","2 tbsp butter","Salt and pepper"], instructions: ["Season salmon with salt and pepper.","Mix honey, garlic and soy sauce.","Sear salmon 4 min per side.","Pour sauce over salmon.","Cook 2 more minutes until glazed.","Serve with lemon wedges."], tags: ["Seafood","Quick","Dinner"], servings: 4 },
  { id: 103, name: "Vegetable Buddha Bowl", author: "Elena Rodriguez", avatar: "ER", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", prepTime: "30 min", cookTime: 25, likes: 19, onMenu: 6, saves: 12, isEasy: false, ingredients: ["1 can chickpeas","1 large sweet potato","1 cup quinoa","2 cups kale","3 tbsp tahini","1 lemon","2 tbsp olive oil","Salt and pepper"], instructions: ["Roast chickpeas and sweet potato at 400F for 25 min.","Cook quinoa.","Massage kale with olive oil.","Make dressing: tahini, lemon, water.","Assemble bowls.","Drizzle with tahini dressing."], tags: ["Vegetarian","Healthy","Lunch"], servings: 4 },
  { id: 104, name: "Korean Beef Tacos", author: "James Kim", avatar: "JK", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop", prepTime: "35 min", cookTime: 30, likes: 42, onMenu: 15, saves: 28, isEasy: false, ingredients: ["1 lb ground beef","2 tbsp gochujang","8 small tortillas","1 cup kimchi","4 green onions","2 tbsp soy sauce","1 tbsp sesame oil","1 tbsp sugar"], instructions: ["Brown beef in pan.","Add gochujang, soy sauce, sesame oil and sugar.","Simmer 5 minutes.","Warm tortillas.","Fill with beef mixture.","Top with kimchi and green onions."], tags: ["Korean","Dinner"], servings: 4 },
  { id: 105, name: "Quick Egg Fried Rice", author: "Sarah Chen", avatar: "SC", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop", prepTime: "15 min", cookTime: 10, likes: 28, onMenu: 10, saves: 18, isEasy: true, ingredients: ["3 cups cooked rice","3 eggs","3 tbsp soy sauce","3 green onions","2 tbsp sesame oil","2 tbsp vegetable oil","Salt and pepper"], instructions: ["Heat oil in wok over high heat.","Scramble eggs, push to side.","Add rice, stir-fry 3-4 minutes.","Add soy sauce and sesame oil.","Toss with eggs and green onions.","Season and serve."], tags: ["Asian","Quick","Lunch"], servings: 2 }
];


// ── FEED POST POOL ────────────────────────────────────────────────────────────
// Posts are grouped into 26 weekly "slots". Each week of the year, a different
// set of ~8 posts is shown — automatically rotating forever, no maintenance needed.
// To add new content: just append to feedPostPool. The rotation handles itself.
const feedPostPool = [
  // ── SEASONAL ──────────────────────────────────────────────────────────────
  { id:'s1', type:'hero', category:'seasonal', tag:'🌸 Spring Picks',
    title:'Fresh Spring Recipes to Brighten Your Week',
    body:"As the weather warms up, it's time to swap heavy stews for vibrant salads, light pasta dishes, and fresh herb-forward cooking. Here are our top picks for the season.",
    image:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop',
    recipe:{id:201,name:'Spring Pea and Mint Risotto',prepTime:'35 min',cookTime:30,servings:4,image:'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',ingredients:['2 cups arborio rice','4 cups vegetable broth','1 cup fresh peas','3 tbsp fresh mint','1/2 cup parmesan','1 onion, diced','2 tbsp butter','1/2 cup white wine','Salt and pepper'],instructions:['Heat broth in a separate pot.','Saute onion in butter until soft.','Add rice, toast 2 minutes.','Add wine and stir until absorbed.','Add broth ladle by ladle, stirring.','Stir in peas in the last 5 minutes.','Finish with parmesan and mint.'],tags:['Vegetarian','Italian','Dinner'],timesMade:0,author:'Recipe Roulette',isEasy:false}},
  { id:'s2', type:'hero', category:'seasonal', tag:'☀️ Summer Grilling',
    title:'Fire Up the Grill — Best Summer Recipes Right Now',
    body:"Long evenings call for smoky flavours, char-grilled vegetables, and anything you can eat outside. These are the recipes worth firing up the grill for this week.",
    image:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=450&fit=crop',
    recipe:{id:205,name:'Honey Sriracha Grilled Chicken',prepTime:'20 min',cookTime:25,servings:4,image:'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&h=300&fit=crop',ingredients:['4 chicken thighs','3 tbsp honey','2 tbsp sriracha','2 tbsp soy sauce','3 cloves garlic','1 lime','Salt and pepper'],instructions:['Mix honey, sriracha, soy sauce and garlic.','Marinate chicken 30 min or overnight.','Grill on medium-high 6-7 min per side.','Rest 5 minutes before serving.','Squeeze lime over top.'],tags:['Grilling','Chicken','Summer'],timesMade:0,author:'Recipe Roulette',isEasy:true}},
  { id:'s3', type:'hero', category:'seasonal', tag:'🍂 Autumn Comfort',
    title:"The Cosy Recipes You'll Make All Autumn Long",
    body:"Shorter days, crispier air, and every reason to spend Sunday afternoon cooking something that fills the house with warmth. These are the dishes that define the season.",
    image:'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&h=450&fit=crop',
    recipe:{id:206,name:'Butternut Squash Soup',prepTime:'15 min',cookTime:35,servings:4,image:'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',ingredients:['1 large butternut squash, cubed','1 onion, diced','3 cloves garlic','4 cups vegetable broth','1 cup coconut milk','2 tbsp olive oil','1 tsp cumin','1 tsp ginger','Salt and pepper'],instructions:['Saute onion and garlic in oil until soft.','Add squash and spices, stir 2 min.','Add broth and simmer 25 minutes.','Blend until smooth.','Stir in coconut milk.','Season and serve with crusty bread.'],tags:['Vegetarian','Soup','Autumn'],timesMade:0,author:'Recipe Roulette',isEasy:true}},
  { id:'s4', type:'hero', category:'seasonal', tag:'❄️ Winter Warmers',
    title:'Slow-Cooked, Hearty, and Built for Cold Nights',
    body:"January calls for the kind of meals that simmer for hours, warm you from the inside, and taste better the next day. Here are our favourite cold-weather recipes of the moment.",
    image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=450&fit=crop',
    recipe:{id:207,name:'Slow-Cooked Beef Stew',prepTime:'20 min',cookTime:180,servings:6,image:'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',ingredients:['2 lbs beef chuck, cubed','4 carrots, chopped','4 potatoes, cubed','2 cups red wine','2 cups beef broth','1 onion','4 cloves garlic','2 tbsp tomato paste','Fresh thyme and rosemary'],instructions:['Brown beef in batches in a heavy pot.','Saute onion and garlic.','Add tomato paste, cook 2 minutes.','Add wine, broth, vegetables and herbs.','Simmer low for 2.5 to 3 hours.','Season and serve with crusty bread.'],tags:['Beef','Winter','Slow Cook'],timesMade:0,author:'Recipe Roulette',isEasy:false}},
  { id:'s5', type:'hero', category:'seasonal', tag:'🌿 Farm to Table',
    title:"Cooking with What's in Season Right Now",
    body:"Late winter into early spring means citrus, root vegetables, and hearty greens are still at their peak. Blood oranges, turnips, kale, and leeks are cheapest and most flavorful right now. Building meals around what's actually in season means better flavor and less waste.",
    image:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=450&fit=crop',
    recipe:{id:204,name:'Roasted Root Vegetable Bowl',prepTime:'15 min',cookTime:40,servings:4,image:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',ingredients:['2 large turnips, cubed','3 carrots, chopped','1 large beet, cubed','2 tbsp olive oil','1 tsp cumin','1 tsp smoked paprika','Salt and pepper','Fresh parsley','Tahini dressing'],instructions:['Preheat oven to 425F.','Toss vegetables with olive oil and spices.','Spread on a baking sheet.','Roast 35-40 minutes, turning halfway.','Serve over grains with tahini dressing.','Garnish with fresh parsley.'],tags:['Vegetarian','Healthy','Dinner'],timesMade:0,author:'Recipe Roulette',isEasy:false}},
  { id:'s6', type:'hero', category:'seasonal', tag:'🌊 Summer Freshness',
    title:'Light, Cold, and Ready in Minutes — Summer Salads',
    body:"When it's too hot to cook, these no-heat recipes are your best friends. Big on flavour, cool to eat, and on the table in under 20 minutes.",
    image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=450&fit=crop',
    recipe:{id:208,name:'Watermelon Feta Mint Salad',prepTime:'10 min',cookTime:0,servings:4,image:'https://images.unsplash.com/photo-1563699697aca-5e6b88cd0ba8?w=400&h=300&fit=crop',ingredients:['4 cups watermelon, cubed','1/2 cup feta cheese, crumbled','1/4 cup fresh mint leaves','2 tbsp olive oil','1 lime, juiced','Pinch of chilli flakes'],instructions:['Cube watermelon and place in a bowl.','Crumble feta over the top.','Scatter mint leaves.','Drizzle with olive oil and lime juice.','Add chilli flakes if desired.','Serve immediately.'],tags:['Salad','Vegetarian','Summer'],timesMade:0,author:'Recipe Roulette',isEasy:true}},

  // ── QUICK MEALS ───────────────────────────────────────────────────────────
  { id:'q1', type:'small', category:'quick', tag:'⚡ 15-Min Meal',
    title:'Garlic Butter Shrimp Tacos',
    body:"Weeknight hero right here. Juicy shrimp tossed in garlic butter, hit with lime, stuffed into warm tortillas with a quick slaw. Done in 15 minutes flat.",
    image:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=450&fit=crop',
    recipe:{id:202,name:'Garlic Butter Shrimp Tacos',prepTime:'15 min',cookTime:10,servings:2,image:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',ingredients:['1 lb shrimp, peeled','8 small tortillas','3 tbsp butter','4 cloves garlic','1 lime','1/2 cup shredded cabbage','2 tbsp sour cream','Fresh cilantro','Salt and pepper'],instructions:['Melt butter in pan over high heat.','Add garlic, cook 30 seconds.','Add shrimp, cook 2 min per side.','Squeeze lime over shrimp.','Warm tortillas.','Fill with shrimp, cabbage and sour cream.','Top with cilantro and serve.'],tags:['Quick','Seafood','Dinner'],timesMade:0,author:'Recipe Roulette',isEasy:true}},
  { id:'q2', type:'small', category:'quick', tag:'🍳 5-Min Breakfast',
    title:'High-Protein Scrambled Eggs',
    body:"Low heat, constant motion, pull off early. The secret to restaurant-quality scrambled eggs is patience and removing from heat while still slightly underdone. Finish with butter and chives.",
    image:'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&h=450&fit=crop',
    recipe:{id:203,name:'Perfect Scrambled Eggs',prepTime:'5 min',cookTime:5,servings:1,image:'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=300&fit=crop',ingredients:['3 large eggs','1 tbsp butter','2 tbsp milk or cream','Salt and pepper','Fresh chives'],instructions:['Whisk eggs with milk, salt and pepper.','Melt butter in pan over low heat.','Add eggs and stir constantly with spatula.','Remove from heat when just slightly underdone.','Finish with extra butter and chives.'],tags:['Breakfast','Quick','Protein'],timesMade:0,author:'Recipe Roulette',isEasy:true}},
  { id:'q3', type:'small', category:'quick', tag:'⚡ 20-Min Dinner',
    title:'One-Pan Lemon Herb Salmon',
    body:"Pan-seared salmon with a butter, lemon and herb sauce that comes together in the same pan. Elegant enough for guests, fast enough for a Tuesday.",
    image:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=450&fit=crop',
    recipe:{id:209,name:'Lemon Herb Pan Salmon',prepTime:'5 min',cookTime:12,servings:2,image:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',ingredients:['2 salmon fillets','3 tbsp butter','3 cloves garlic','1 lemon','Fresh dill and parsley','Salt and pepper','Olive oil'],instructions:['Pat salmon dry, season well.','Heat oil in pan on medium-high.','Cook salmon 4-5 min per side.','Remove salmon and reduce heat.','Add butter and garlic, cook 1 min.','Squeeze in lemon, add herbs.','Pour sauce over salmon and serve.'],tags:['Seafood','Quick','Healthy'],timesMade:0,author:'Recipe Roulette',isEasy:true}},
  { id:'q4', type:'small', category:'quick', tag:'⚡ Weeknight Win',
    title:'Creamy Tomato Pasta in 25 Minutes',
    body:"No cream needed — just a can of tomatoes, garlic, pasta water, and parmesan doing the heavy lifting. One of those recipes that tastes like it took far longer than it did.",
    image:'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=450&fit=crop',
    recipe:{id:210,name:'Quick Creamy Tomato Pasta',prepTime:'5 min',cookTime:20,servings:3,image:'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',ingredients:['300g pasta','1 can crushed tomatoes','4 cloves garlic','1/2 cup parmesan','2 tbsp olive oil','1 tsp chilli flakes','Fresh basil','Salt and pepper'],instructions:['Cook pasta, reserve 1 cup pasta water.','Saute garlic in oil until golden.','Add tomatoes and chilli, simmer 10 min.','Add pasta and splash of pasta water.','Stir in parmesan until creamy.','Top with basil and serve.'],tags:['Pasta','Quick','Vegetarian'],timesMade:0,author:'Recipe Roulette',isEasy:true}},
  { id:'q5', type:'small', category:'quick', tag:'🌯 Easy Lunch',
    title:'5-Ingredient Chicken Caesar Wrap',
    body:"Rotisserie chicken, romaine, caesar dressing, parmesan, and a wrap. That's it. Assemble in 5 minutes. This is the lunch you make when you have nothing planned and everything in the fridge.",
    image:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=450&fit=crop',
    recipe:{id:211,name:'Chicken Caesar Wrap',prepTime:'5 min',cookTime:0,servings:1,image:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',ingredients:['1 large wrap/tortilla','1 cup rotisserie chicken, shredded','1 cup romaine lettuce','3 tbsp caesar dressing','2 tbsp parmesan, grated','Cracked black pepper'],instructions:['Lay wrap flat.','Layer lettuce and chicken.','Drizzle caesar dressing.','Add parmesan and black pepper.','Roll tightly and slice in half.'],tags:['Lunch','Quick','Chicken'],timesMade:0,author:'Recipe Roulette',isEasy:true}},

  // ── TIPS ──────────────────────────────────────────────────────────────────
  { id:'t1', type:'tip', category:'tip', tag:'💡 Pro Tip',
    title:'Salt Your Pasta Water Like the Sea',
    body:"The most common pasta mistake? Under-salted water. Your pasta water should taste genuinely salty — about 1 tablespoon of salt per 4 cups of water. The pasta absorbs it as it cooks, building flavor from the inside out. No amount of sauce can fix bland pasta.",
    image:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=450&fit=crop', recipe:null},
  { id:'t2', type:'tip', category:'tip', tag:'🔪 Knife Skills',
    title:'The Claw Grip Saves Fingers',
    body:"Curl your fingertips inward when chopping so your knuckles guide the blade. It feels awkward at first but becomes second nature fast — and it's the single most effective way to avoid cutting yourself. Professional chefs never chop any other way.",
    image:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=450&fit=crop', recipe:null},
  { id:'t3', type:'tip', category:'tip', tag:'🧄 Flavour Basics',
    title:'Build Flavour in Layers, Not All at Once',
    body:"Add aromatics (garlic, onion, ginger) first in fat. Then add dry spices and toast briefly. Then add your protein. Then liquid. Each layer builds on the last. Adding everything at once is the most common reason home cooking tastes flat.",
    image:'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=450&fit=crop', recipe:null},
  { id:'t4', type:'tip', category:'tip', tag:'🧊 Freezer Hack',
    title:'Freeze Your Herbs in Olive Oil',
    body:"Instead of watching fresh herbs go limp in the fridge, chop them and pack them into ice cube trays topped with olive oil. Freeze solid, then transfer to a bag. Drop a cube directly into any pan — instant fresh herb flavour all year, zero waste.",
    image:'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&h=450&fit=crop', recipe:null},
  { id:'t5', type:'tip', category:'tip', tag:'🥩 Meat Tip',
    title:'Always Rest Your Meat Before Cutting',
    body:"The biggest mistake people make with steak, chicken, or pork: cutting it immediately off the heat. Resting allows the juices to redistribute back through the meat. 5 minutes for chicken, 10 minutes for steak. Skip this and all the juice ends up on your cutting board instead of in your mouth.",
    image:'https://images.unsplash.com/photo-1558030137-a56c1b781cd8?w=800&h=450&fit=crop', recipe:null},
  { id:'t6', type:'tip', category:'tip', tag:'🍳 Pan Temp',
    title:'Your Pan is Probably Not Hot Enough',
    body:"If your food is sticking, steaming instead of searing, or going grey instead of brown — your pan isn't hot enough. Heat your pan until a drop of water immediately evaporates and dances. Then add oil. Then add food. The Maillard reaction only happens above 300°F/150°C.",
    image:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=450&fit=crop', recipe:null},
  { id:'t7', type:'tip', category:'tip', tag:'🧂 Season Right',
    title:'Season at Every Stage, Not Just at the End',
    body:"Salt brings out flavour — but only when it has time to work. Season your onions as they cook, your meat before it goes in the pan, your sauce as it simmers. A pinch at each stage builds depth that a heavy hand at the end can never replicate.",
    image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=450&fit=crop', recipe:null},
  { id:'t8', type:'tip', category:'tip', tag:'🫙 Pantry Power',
    title:'The 5 Pantry Items That Improve Everything',
    body:"Stock these and you'll never have a boring meal: fish sauce (umami depth), miso paste (salty richness), smoked paprika (instant warmth), apple cider vinegar (brightens any dish), and a good hot sauce. A teaspoon of any of these elevates even the simplest weeknight meal.",
    image:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=450&fit=crop', recipe:null},

  // ── NUTRITION ─────────────────────────────────────────────────────────────
  { id:'n1', type:'small', category:'nutrition', tag:'🥗 Nutrition',
    title:'Why You Should Eat the Rainbow',
    body:"Different colored fruits and vegetables contain different phytonutrients. Red for lycopene, orange for beta-carotene, green for folate, purple for anthocyanins. Aim for at least 3 colors on your plate every meal.",
    image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=450&fit=crop', recipe:null},
  { id:'n2', type:'small', category:'nutrition', tag:'💪 Meal Prep',
    title:'Batch Cook These 3 Things Every Sunday',
    body:"Cook a big batch of grains (quinoa or rice), roast a sheet pan of vegetables, and prep a versatile protein (chicken or chickpeas). Mix and match all week into bowls, wraps and salads without cooking from scratch every night.",
    image:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=450&fit=crop', recipe:null},
  { id:'n3', type:'small', category:'nutrition', tag:'🫀 Heart Health',
    title:'The Mediterranean Diet Actually Works',
    body:"Decades of research consistently show the Mediterranean diet reduces heart disease risk by up to 30%. The core isn't complicated: olive oil over butter, fish twice a week, legumes often, lots of vegetables, moderate red wine, and very little processed food.",
    image:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=450&fit=crop', recipe:null},
  { id:'n4', type:'small', category:'nutrition', tag:'⚡ Energy Foods',
    title:'What to Eat for Sustained Energy (Not a Sugar Crash)',
    body:"Skip the mid-afternoon slump by pairing complex carbs with protein and fat. Oats with nut butter, apple with cheese, hummus with vegetables. The fat and protein slow the absorption of carbohydrates, giving you steady energy instead of a spike and crash.",
    image:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop', recipe:null},
  { id:'n5', type:'small', category:'nutrition', tag:'🌱 Protein',
    title:'Getting Enough Protein Without Eating Meat All Day',
    body:"Legumes, lentils, Greek yogurt, eggs, tofu, edamame, and cottage cheese are all protein powerhouses. A cup of lentils has 18g of protein. Pair them strategically throughout the day and you'll hit your targets without relying on meat for every meal.",
    image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=450&fit=crop', recipe:null},

  // ── COOKING TIPS & TRICKS (VIDEO CARDS) ──────────────────────────────────
  { id:'v1', type:'video', category:'video', tag:'🎬 Cooking Tips & Tricks',
    title:"Gordon Ramsay's Perfect Scrambled Eggs",
    body:"Low heat, constant motion, off the pan early. Three minutes of watching this will change how you scramble eggs forever.",
    youtubeId:'ZJy1ajvMU1k', channel:'Gordon Ramsay', duration:'3:14',
    thumbnail:`https://img.youtube.com/vi/ZJy1ajvMU1k/hqdefault.jpg` },
  { id:'v2', type:'video', category:'video', tag:'🎬 Cooking Tips & Tricks',
    title:'How to Season a Cast Iron Pan Properly',
    body:"Cast iron is the most forgiving pan you can own — once you know how to take care of it. This is the definitive guide.",
    youtubeId:'t-WHGOPWRFE', channel:'Ethan Chlebowski', duration:'8:22',
    thumbnail:`https://img.youtube.com/vi/t-WHGOPWRFE/hqdefault.jpg` },
  { id:'v3', type:'video', category:'video', tag:'🎬 Cooking Tips & Tricks',
    title:'Knife Skills Every Home Cook Should Know',
    body:"The claw grip, the rocking motion, how to hold the knife. Ten minutes of practice here saves fingers for a lifetime.",
    youtubeId:'0OHhoPz16NE', channel:'Jamie Oliver', duration:'7:45',
    thumbnail:`https://img.youtube.com/vi/0OHhoPz16NE/hqdefault.jpg` },
  { id:'v4', type:'video', category:'video', tag:'🎬 Cooking Tips & Tricks',
    title:'Meal Prep for the Whole Week in 1 Hour',
    body:"Batch grains, roast a sheet pan, prep your protein. This is the system that makes weeknight cooking effortless.",
    youtubeId:'ogroTh_CNbg', channel:'Joshua Weissman', duration:'12:40',
    thumbnail:`https://img.youtube.com/vi/ogroTh_CNbg/hqdefault.jpg` },
  { id:'v5', type:'video', category:'video', tag:'🎬 Cooking Tips & Tricks',
    title:'How to Make Perfect Pasta Every Time',
    body:"Salt the water like the sea, pull it early, finish it in the sauce. The Italians figured this out centuries ago.",
    youtubeId:'0MeX2p2G_oA', channel:'Italia Squisita', duration:'6:18',
    thumbnail:`https://img.youtube.com/vi/0MeX2p2G_oA/hqdefault.jpg` },
  { id:'v6', type:'video', category:'video', tag:'🎬 Cooking Tips & Tricks',
    title:'5 Sauces Every Cook Should Know',
    body:"Master these five and you can riff on almost any dish. Béchamel, vinaigrette, pan sauce, salsa verde, and a quick tomato.",
    youtubeId:'U4KDxTVXoxI', channel:'Ethan Chlebowski', duration:'14:02',
    thumbnail:`https://img.youtube.com/vi/U4KDxTVXoxI/hqdefault.jpg` },

  // ── COMMUNITY ─────────────────────────────────────────────────────────────
  { id:'c1', type:'hero', category:'community', tag:'⭐ Community Favourite',
    title:"The Recipe Everyone is Adding to Their Plan",
    body:"Korean Beef Tacos have taken over the community this week — 42 households and counting. Bold, fast, and endlessly satisfying. If you haven't tried it yet, now's the time.",
    image:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=450&fit=crop',
    recipe:{id:104,name:'Korean Beef Tacos',prepTime:'35 min',cookTime:30,servings:4,image:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',ingredients:['1 lb ground beef','2 tbsp gochujang','8 small tortillas','1 cup kimchi','4 green onions','2 tbsp soy sauce','1 tbsp sesame oil','1 tbsp sugar'],instructions:['Brown beef in pan.','Add gochujang, soy sauce, sesame oil and sugar.','Simmer 5 minutes.','Warm tortillas.','Fill with beef mixture.','Top with kimchi and green onions.'],tags:['Korean','Dinner'],timesMade:0,author:'James Kim',isEasy:false}},
  { id:'c2', type:'hero', category:'community', tag:'🏆 Most Made This Month',
    title:"The Community's Most-Cooked Recipe Right Now",
    body:"Classic Chicken Tikka Masala is on meal plans in 38 households this week. Rich, fragrant, and deeply satisfying — this is the recipe that keeps coming back to the top of the rotation.",
    image:'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=450&fit=crop',
    recipe:{id:101,name:'Chicken Tikka Masala',prepTime:'45 min',cookTime:40,servings:4,image:'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop',ingredients:['1.5 lbs chicken breast','1 cup yogurt','2 tbsp garam masala','1 can crushed tomatoes','1 cup heavy cream','1 onion','4 cloves garlic','1 tbsp ginger','2 tbsp butter'],instructions:['Marinate chicken in yogurt and spices 1 hour.','Grill or broil chicken until charred.','Saute onion, garlic and ginger in butter.','Add tomatoes and simmer 15 minutes.','Stir in cream and chicken.','Simmer 10 more minutes.'],tags:['Indian','Chicken','Dinner'],timesMade:0,author:'Priya Sharma',isEasy:false}},
  { id:'c3', type:'hero', category:'community', tag:'🌟 Rising Recipe',
    title:"This Week's Breakout Hit in the Community",
    body:"Miso Glazed Salmon appeared in 29 meal plans this week and climbed to 4.9 stars. Three ingredients, fifteen minutes, and somehow it tastes like a restaurant dish. We're not surprised it went viral.",
    image:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=450&fit=crop',
    recipe:{id:102,name:'Miso Glazed Salmon',prepTime:'25 min',cookTime:15,servings:2,image:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',ingredients:['2 salmon fillets','3 tbsp white miso','2 tbsp mirin','1 tbsp soy sauce','1 tbsp sugar','Sesame seeds','Green onions'],instructions:['Mix miso, mirin, soy and sugar.','Coat salmon and marinate 30 min.','Broil 10-12 minutes until caramelized.','Garnish with sesame seeds and green onions.'],tags:['Japanese','Seafood','Quick'],timesMade:0,author:'Yuki Tanaka',isEasy:true}},
  { id:'c4', type:'hero', category:'community', tag:'👨‍👩‍👧 Family Favourite',
    title:"The Recipe Families Keep Coming Back To",
    body:"Beef Enchiladas have held steady in the top 5 for three weeks running. Kid-approved, freezer-friendly, and the leftovers might be better than the original. A true household staple.",
    image:'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=800&h=450&fit=crop',
    recipe:{id:103,name:'Beef Enchiladas',prepTime:'30 min',cookTime:35,servings:6,image:'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=400&h=300&fit=crop',ingredients:['1 lb ground beef','8 flour tortillas','2 cups enchilada sauce','1.5 cups shredded cheese','1 onion, diced','2 tsp cumin','1 tsp chilli powder','Sour cream and cilantro to serve'],instructions:['Brown beef with onion and spices.','Fill tortillas with beef and roll.','Place seam-down in baking dish.','Pour sauce over top.','Cover with cheese.','Bake 350F for 25 minutes.'],tags:['Mexican','Beef','Family'],timesMade:0,author:'Maria Gonzalez',isEasy:false}},
];

// ── WEEKLY ROTATING FEED ──────────────────────────────────────────────────
// Uses current week number to deterministically pick 8 posts from the pool.
// Changes every Monday, same for all users, zero maintenance required.
const getWeeklyFeedPosts = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.floor((now - startOfYear) / (7 * 24 * 60 * 60 * 1000));
  const month = now.getMonth(); // 0=Jan ... 11=Dec

  // Only show seasonal content that matches the current season
  // Winter: Dec-Feb, Spring: Mar-May, Summer: Jun-Aug, Autumn: Sep-Nov
  const currentSeasonTags = (() => {
    if (month >= 2 && month <= 4) return ['spring', 'farm'];       // Mar–May
    if (month >= 5 && month <= 7) return ['summer'];               // Jun–Aug
    if (month >= 8 && month <= 10) return ['autumn'];              // Sep–Nov
    return ['winter', 'farm'];                                      // Dec–Feb
  })();

  const isRelevantSeasonal = (p) => {
    if (p.category !== 'seasonal') return false;
    const tagLower = (p.tag || '').toLowerCase();
    return currentSeasonTags.some(s => tagLower.includes(s));
  };

  const allSeasonal = feedPostPool.filter(p => p.category === 'seasonal');
  const relevantSeasonal = allSeasonal.filter(isRelevantSeasonal);
  // Fall back to farm-to-table / generic if nothing matches (shouldn't happen)
  const seasonalPool = relevantSeasonal.length > 0 ? relevantSeasonal : allSeasonal;

  const byCategory = {
    seasonal: seasonalPool,
    quick:    feedPostPool.filter(p => p.category === 'quick'),
    tip:      feedPostPool.filter(p => p.category === 'tip'),
    nutrition:feedPostPool.filter(p => p.category === 'nutrition'),
    community:feedPostPool.filter(p => p.category === 'community'),
    video:    feedPostPool.filter(p => p.category === 'video'),
  };

  const pick = (arr, offset) => arr[(weekNum + offset) % arr.length];

  return [
    pick(byCategory.seasonal,  0),  // hero — in-season only
    pick(byCategory.tip,       0),  // tip
    pick(byCategory.quick,     0),  // quick meal
    pick(byCategory.community, 0),  // community hero
    pick(byCategory.video,     0),  // cooking tips & tricks video
    pick(byCategory.nutrition, 0),  // nutrition
    pick(byCategory.tip,       1),  // second tip
    pick(byCategory.quick,     1),  // second quick meal
  ];
};

const feedPosts = getWeeklyFeedPosts();

// ── TRENDING RECIPES ──────────────────────────────────────────────────────
// Seeded for now — swap for a Supabase query when real user volume exists.
const trendingRecipes = [
  { id:2010, name:'Basic Chili', addedCount:42, weeklyAdds:12, image:'https://www.budgetbytes.com/wp-content/uploads/2018/09/Basic-Chili-in-Bowl-1200-368x276.jpg', tags:['Dinner','Easy'], prepTime:'5 min', servings:6, cookTime:45, collection:'budget-bytes', ingredients:['1 lb ground beef','1 onion, diced','4 cloves garlic, minced','2 tbsp chili powder','1 tsp cumin','1 tsp smoked paprika','1/2 tsp oregano','1/4 tsp cayenne pepper','1 can kidney beans, drained','1 can diced tomatoes','1 can tomato paste','1 cup beef broth','Salt to taste'], instructions:['Brown ground beef, drain fat.','Add onion and garlic, cook 3 min.','Add all spices, stir 1 min.','Add beans, tomatoes, paste and broth.','Simmer 30-35 min until thickened.','Season and serve with toppings.'], timesMade:0, isEasy:true, macros:{calories:350,protein:27,carbs:28,fat:14,fiber:9,sugar:6,sodium:640} },
  { id:2044, name:'Healthy Chicken Tikka Masala', addedCount:38, weeklyAdds:9, image:'https://www.skinnytaste.com/wp-content/uploads/2018/03/Skinny-Chicken-Tikka-Masala-5-500x500.jpg', tags:['Indian','Healthy'], prepTime:'20 min', servings:4, cookTime:30, collection:'skinnytaste', ingredients:['1.5 lbs chicken breast, cubed','1 cup plain yogurt','2 tbsp garam masala','1 can crushed tomatoes','1/2 cup light coconut milk','1 onion, diced','4 cloves garlic','1 tbsp ginger','2 tbsp butter','Salt and pepper'], instructions:['Marinate chicken in yogurt and 1 tbsp garam masala 30 min.','Brown chicken in a skillet, set aside.','Saute onion, garlic and ginger in butter.','Add remaining garam masala, cook 1 min.','Add tomatoes, simmer 10 min.','Stir in coconut milk and chicken, simmer 10 more min.','Season and serve with rice.'], timesMade:0, isEasy:true, macros:{calories:320,protein:38,carbs:14,fat:12,fiber:3,sugar:8,sodium:520} },
  { id:2061, name:'Garlic Butter Shrimp and Orzo', addedCount:31, weeklyAdds:8, image:'https://damndelicious.net/wp-content/uploads/2025/12/One-Pot-Garlic-Butter-Shrimp-and-Orzo_126-360x540.jpg', tags:['Dinner','Easy'], prepTime:'10 min', servings:4, cookTime:20, collection:'damn-delicious', ingredients:['1 lb large shrimp, peeled','1.5 cups orzo','4 cloves garlic, minced','4 tbsp butter, divided','2 cups chicken broth','1 cup water','1/2 cup white wine','1/2 cup Parmesan','2 tbsp parsley','1 lemon, zested and juiced','1/4 tsp red pepper flakes','Salt and pepper'], instructions:['Cook shrimp in 2 tbsp butter 1-2 min per side. Remove.','Cook garlic and red pepper flakes in remaining butter 1 min.','Add wine and bubble 1 min.','Add orzo, broth and water. Simmer 10-12 min stirring often.','Stir in Parmesan and lemon.','Return shrimp, toss and serve with parsley.'], timesMade:0, isEasy:true, macros:{calories:430,protein:28,carbs:46,fat:14,fiber:2,sugar:3,sodium:720} },
  { id:2001, name:'Chicken Noodle Soup', addedCount:29, weeklyAdds:7, image:'https://www.budgetbytes.com/wp-content/uploads/2017/02/Chicken-Noodle-Soup-Overhead-368x276.jpg', tags:['Soup','Easy'], prepTime:'15 min', servings:8, cookTime:90, collection:'budget-bytes', ingredients:['2 lbs bone-in chicken pieces','3 carrots, sliced','3 stalks celery, sliced','1 onion, diced','4 cloves garlic, minced','8 oz egg noodles','8 cups chicken broth','1 tsp dried thyme','1 tsp dried parsley','Salt and pepper','2 tbsp olive oil'], instructions:['Saute onion, carrots and celery in oil 5 min.','Add garlic, cook 1 min.','Add chicken and broth, simmer 1 hour.','Remove chicken, shred meat.','Add noodles and cook through.','Return chicken, add herbs and season.'], timesMade:0, isEasy:true, macros:{calories:280,protein:26,carbs:24,fat:8,fiber:2,sugar:3,sodium:680} },
  { id:2112, name:'Tikka Masala Soup', addedCount:26, weeklyAdds:6, image:'https://images.themodernproper.com/production/posts/2019/Tikka-Masala-Soup-8_191019_231153.jpg?w=400&q=82&auto=format&fit=crop&dm=1771345301&s=4f62523a6ec10ce50e4bc7844fd9370d', tags:['Soup','Healthy'], prepTime:'40 min', servings:6, cookTime:30, collection:'modern-proper', ingredients:['1.5 lbs chicken breast','1 can (14 oz) crushed tomatoes','1 can (14 oz) coconut milk','1 onion, diced','4 cloves garlic','1 tbsp ginger','2 tbsp tikka masala paste','1 tsp garam masala','2 cups chicken broth','Fresh cilantro','Naan to serve'], instructions:['Brown chicken in a pot, set aside.','Saute onion, garlic and ginger.','Add tikka masala paste and garam masala, cook 1 min.','Add tomatoes, coconut milk and broth.','Return chicken, simmer 20 min.','Shred chicken in the pot.','Serve with naan and cilantro.'], timesMade:0, isEasy:true, macros:{calories:310,protein:32,carbs:12,fat:16,fiber:3,sugar:6,sodium:580} },
  { id:2005, name:'One Pot Cajun Chicken Pasta', addedCount:24, weeklyAdds:5, image:'https://www.budgetbytes.com/wp-content/uploads/2018/10/One-Pot-Creamy-Cajun-Chicken-Pasta-pan-368x276.jpg', tags:['Dinner','Easy'], prepTime:'10 min', servings:4, cookTime:20, collection:'budget-bytes', ingredients:['1 lb chicken breast, cubed','2 tsp Cajun seasoning','2 tbsp olive oil','3 cloves garlic, minced','1 can diced tomatoes','2.5 cups chicken broth','8 oz penne','1/2 cup heavy cream','2 green onions','Salt and pepper'], instructions:['Season chicken with Cajun seasoning.','Brown chicken in oil, remove.','Saute garlic, add tomatoes and broth, boil.','Add pasta, cover and cook 12 min.','Stir in cream and return chicken.','Simmer 2-3 min, top with green onions.'], timesMade:0, isEasy:true, macros:{calories:510,protein:36,carbs:48,fat:18,fiber:3,sugar:5,sodium:780} },
];

// ── HOW-TO VIDEOS ─────────────────────────────────────────────────────────
// Add YouTube video IDs here to grow the video library.
// Categories: 'technique' | 'recipe' | 'tips' | 'mealprep'
const howToVideos = [
  { id:'v1', youtubeId:'ZJy1ajvMU1k', title:"Gordon Ramsay's Perfect Scrambled Eggs", channel:'Gordon Ramsay', duration:'3:14', category:'technique' },
  { id:'v2', youtubeId:'t-WHGOPWRFE', title:'How to Properly Season a Cast Iron Pan', channel:'Ethan Chlebowski', duration:'8:22', category:'technique' },
  { id:'v3', youtubeId:'0OHhoPz16NE', title:'Knife Skills for Beginners', channel:'Jamie Oliver', duration:'7:45', category:'technique' },
  { id:'v4', youtubeId:'ogroTh_CNbg', title:'Meal Prep for the Week in 1 Hour', channel:'Joshua Weissman', duration:'12:40', category:'mealprep' },
  { id:'v5', youtubeId:'0MeX2p2G_oA', title:'How to Make the Perfect Pasta Every Time', channel:'Italia Squisita', duration:'6:18', category:'recipe' },
  { id:'v6', youtubeId:'U4KDxTVXoxI', title:'5 Sauces Every Cook Should Know', channel:'Ethan Chlebowski', duration:'14:02', category:'tips' },
  { id:'v7', youtubeId:'ylQLnqIFqzI', title:'Meal Prep Like a Pro — Full Week Plan', channel:'Workweek Lunch', duration:'18:33', category:'mealprep' },
  { id:'v8', youtubeId:'M_4SQBiMLbg', title:'The Science of Searing — Why It Matters', channel:'Kenji López-Alt', duration:'10:15', category:'technique' },
];

const emptyMealPlan = {
  0:{breakfast:null,lunch:null,dinner:null},
  1:{breakfast:null,lunch:null,dinner:null},
  2:{breakfast:null,lunch:null,dinner:null},
  3:{breakfast:null,lunch:null,dinner:null},
  4:{breakfast:null,lunch:null,dinner:null},
  5:{breakfast:null,lunch:null,dinner:null},
  6:{breakfast:null,lunch:null,dinner:null}
};

const AuthScreen = ({ onGuest }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage('Account created! Check your email to confirm, then log in.');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'#f4f0ea',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{width:'100%',maxWidth:'420px'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAQABgADASIAAhEBAxEB/8QAHQABAAEFAQEBAAAAAAAAAAAAAAgBAgYHCQMFBP/EAGYQAAIBAwIEAwQGBQUKCAoDEQABAgMEBQYRBxIhMQgTQSJRYXEJFDKBkaEVI0JSsTNicoKSFiRDU5Oio8HR4Rclc4Oys7TwNDdUY5TCw8TT8SYnREZWdHakNmTkGDVVZnWEhaXS/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/AIZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/9k=" alt="Logo" style={{width:'220px',height:'220px',objectFit:'contain',marginBottom:'8px'}} />
          <p style={{margin:0,color:'#6a6050',fontSize:'15px'}}>Plan together, eat better</p>
        </div>
        <div style={{background:'#fefcf8',borderRadius:'12px',padding:'32px',border:'1px solid #e0d8cc'}}>
          <div style={{display:'flex',gap:'8px',marginBottom:'24px',background:'#f4f0ea',borderRadius:'8px',padding:'4px'}}>
            {['login','signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setMessage(''); }}
                style={{flex:1,padding:'10px',background:mode===m?'#ffffff':'transparent',color:mode===m?'#000000':'#999',border:'none',borderRadius:'6px',fontWeight:600,fontSize:'14px',cursor:'pointer'}}>
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>
          <form onSubmit={handle}>
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',marginBottom:'6px',fontWeight:600,color:'#1c2820',fontSize:'14px'}}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                style={{width:'100%',padding:'11px 14px',border:'1px solid #e0d8cc',borderRadius:'8px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',outline:'none',boxSizing:'border-box'}} />
            </div>
            <div style={{marginBottom:'24px'}}>
              <label style={{display:'block',marginBottom:'6px',fontWeight:600,color:'#1c2820',fontSize:'14px'}}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" minLength={6}
                style={{width:'100%',padding:'11px 14px',border:'1px solid #e0d8cc',borderRadius:'8px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',outline:'none',boxSizing:'border-box'}} />
            </div>
            {error && <div style={{background:'#2d1515',border:'1px solid #ff4444',borderRadius:'8px',padding:'12px',marginBottom:'16px',color:'#c46a3a',fontSize:'13px'}}>{error}</div>}
            {message && <div style={{background:'#152d1a',border:'1px solid #5a9a6a',borderRadius:'8px',padding:'12px',marginBottom:'16px',color:'#5a9a6a',fontSize:'13px'}}>{message}</div>}
            <button type="submit" disabled={loading}
              style={{width:'100%',padding:'13px',background:'#1c2820',color:'#f0ece4',border:'none',borderRadius:'8px',fontSize:'15px',fontWeight:700,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1}}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
            <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'20px 0 0'}}>
              <div style={{flex:1,height:'1px',background:'#f0ece4'}} />
              <span style={{color:'#7a7060',fontSize:'12px',fontWeight:600}}>OR</span>
              <div style={{flex:1,height:'1px',background:'#f0ece4'}} />
            </div>
            <button type="button" onClick={onGuest}
              style={{width:'100%',marginTop:'12px',padding:'13px',background:'transparent',color:'#9a9080',border:'1px solid #e0d8cc',borderRadius:'8px',fontSize:'14px',fontWeight:600,cursor:'pointer'}}>
              👀 View as Guest
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


const PublicUserRecipes = ({ userId, onSelect }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('user_recipes').select('recipe').eq('user_id', userId);
      setRecipes(data ? data.map(r => r.recipe) : []);
      setLoading(false);
    };
    load();
  }, [userId]);
  if (loading) return <p style={{color:'#6a6050',fontSize:'13px',textAlign:'center',padding:'20px 0'}}>Loading...</p>;
  if (recipes.length === 0) return <p style={{color:'#6a6050',fontSize:'13px',textAlign:'center',padding:'20px 0'}}>No public recipes yet</p>;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
      {recipes.map(r => (
        <div key={r.id} onClick={() => onSelect(r)}
          style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px',background:'#f0ece4',borderRadius:'8px',cursor:'pointer'}}>
          <div style={{width:'44px',height:'44px',borderRadius:'8px',backgroundImage:`url(${r.image})`,backgroundSize:'cover',backgroundPosition:'center',flexShrink:0,background:'#333'}} />
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,color:'#1c2820',fontSize:'13px',marginBottom:'2px'}}>{r.name}</div>
            <div style={{fontSize:'11px',color:'#6a6050'}}>{r.prepTime} · {r.servings} servings</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SharedRecipeView = ({ shareId }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('shared_recipes').select('recipe').eq('id', shareId).single();
      if (error || !data) { setError('Recipe not found.'); }
      else { setRecipe(data.recipe); }
      setLoading(false);
    };
    load();
  }, [shareId]);

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#fefcf8',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:'#6a6050',fontSize:'16px'}}>Loading recipe...</p>
    </div>
  );
  if (error || !recipe) return (
    <div style={{minHeight:'100vh',background:'#fefcf8',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'12px',padding:'20px'}}>
      <p style={{fontSize:'40px'}}>🍽</p>
      <p style={{color:'#1c2820',fontSize:'18px',fontWeight:700}}>Recipe not found</p>
      <a href="/" style={{color:'#2a3a7a',fontSize:'14px'}}>Go to Recipe Roulette →</a>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#fefcf8',color:'#1c2820',fontFamily:"'Jost',sans-serif",overflowX:'hidden'}}>
      {/* Header */}
      <div style={{background:'#fefcf8',borderBottom:'1px solid #e8e0d4',padding:'14px 16px',display:'flex',alignItems:'center',gap:'10px'}}>
        <span style={{fontSize:'20px'}}>🍽</span>
        <span style={{fontWeight:700,fontSize:'15px',flex:1,minWidth:0}}><span style={{fontFamily:"'Libre Baskerville',serif",fontWeight:700,color:'#f0ece4'}}>Recipe </span><span style={{fontFamily:"'Libre Baskerville',serif",fontStyle:'italic',fontWeight:400,color:'#c46a3a'}}>Roulette</span></span>
        <a href="/" style={{flexShrink:0,padding:'8px 14px',background:'#1c2820',color:'#f0ece4',borderRadius:'8px',textDecoration:'none',fontWeight:600,fontSize:'13px',whiteSpace:'nowrap'}}>Try the App →</a>
      </div>

      {/* Recipe content */}
      <div style={{maxWidth:'720px',margin:'0 auto',padding:'20px 16px',boxSizing:'border-box',width:'100%'}}>
        {recipe.image && (
          <div style={{height:'220px',backgroundImage:`url(${recipe.image})`,backgroundSize:'cover',backgroundPosition:'center',borderRadius:'12px',marginBottom:'20px'}} />
        )}
        <h1 style={{fontSize:'24px',fontWeight:800,color:'#1c2820',margin:'0 0 10px 0',lineHeight:1.2,wordBreak:'break-word'}}>{recipe.name}</h1>
        <div style={{display:'flex',gap:'12px',fontSize:'13px',color:'#9a9080',marginBottom:'16px',flexWrap:'wrap'}}>
          {recipe.prepTime && <span>⏱ {recipe.prepTime}</span>}
          {recipe.cookTime && <span>🔥 {recipe.cookTime} min</span>}
          {recipe.servings && <span>🍽 {recipe.servings} servings</span>}
          {recipe.author && <span>👤 {recipe.author}</span>}
        </div>
        {recipe.tags?.length > 0 && (
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'20px'}}>
            {recipe.tags.map(t => <span key={t} style={{padding:'4px 10px',background:'#fefcf8',border:'1px solid #e0d8cc',borderRadius:'20px',fontSize:'12px',color:'#9a9080'}}>{t}</span>)}
          </div>
        )}
        {recipe.ingredients?.length > 0 && (
          <div style={{marginBottom:'16px',background:'#fefcf8',borderRadius:'12px',padding:'16px',border:'1px solid #e0d8cc'}}>
            <h2 style={{fontSize:'17px',fontWeight:700,color:'#1c2820',margin:'0 0 12px 0'}}>Ingredients</h2>
            <ul style={{paddingLeft:'18px',margin:0}}>
              {recipe.ingredients.map((ing, i) => <li key={i} style={{marginBottom:'7px',color:'#a0988a',lineHeight:1.5,fontSize:'14px'}}>{ing}</li>)}
            </ul>
          </div>
        )}
        {recipe.instructions?.length > 0 && (
          <div style={{marginBottom:'24px',background:'#fefcf8',borderRadius:'12px',padding:'16px',border:'1px solid #e0d8cc'}}>
            <h2 style={{fontSize:'17px',fontWeight:700,color:'#1c2820',margin:'0 0 12px 0'}}>Instructions</h2>
            <ol style={{paddingLeft:'18px',margin:0}}>
              {recipe.instructions.map((step, i) => <li key={i} style={{marginBottom:'12px',color:'#a0988a',lineHeight:1.6,fontSize:'14px'}}>{step}</li>)}
            </ol>
          </div>
        )}
        <div style={{background:'#fefcf8',borderRadius:'12px',padding:'20px',textAlign:'center',border:'1px solid #e0d8cc',marginBottom:'32px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}><img src="/logo.png" alt="Recipe Roulette" style={{width:'28px',height:'28px',objectFit:'contain'}} /><p style={{margin:0,fontSize:'17px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Recipe Roulette</p></div>
          <p style={{margin:'0 0 14px 0',fontSize:'13px',color:'#6a6050'}}>Plan your meals, import recipes, and more</p>
          <a href="/" style={{display:'inline-block',padding:'11px 28px',background:'#1c2820',color:'#f0ece4',borderRadius:'8px',textDecoration:'none',fontWeight:700,fontSize:'14px'}}>Try it free →</a>
        </div>
      </div>
    </div>
  );
};
const MealPrepApp = ({ pendingJoinCode }) => {
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [guestMode, setGuestMode] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [profile, setProfile] = useState({
    displayName: '',
    phone: '',
    zipCode: '',
    avatarUrl: '',
    avatarPreview: '',
    dietaryPrefs: [],
    groceryPrefs: [],
    householdSize: 2,
    adults: 2,
    children: 0
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [currentView, setCurrentView] = useState('calendar');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState('all');
  const [playingVideo, setPlayingVideo] = useState(null);
  const [folders, setFolders] = useState([
    {id:'f1', name:'House Favorites', emoji:'🏠', recipes:[]}
  ]);
  const [activeFolder, setActiveFolder] = useState(null); // null = show all folders
  const [showFolderModal, setShowFolderModal] = useState(false); // create new folder
  const [showSaveToFolderModal, setShowSaveToFolderModal] = useState(null); // recipe to save
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderEmoji, setNewFolderEmoji] = useState('📁');
  const [showFolderOptionsMenu, setShowFolderOptionsMenu] = useState(null); // folder id
  const [showEditFolderModal, setShowEditFolderModal] = useState(null); // folder object
  const [showDeleteFolderConfirm, setShowDeleteFolderConfirm] = useState(null); // folder object
  const [editFolderName, setEditFolderName] = useState('');
  const [editFolderEmoji, setEditFolderEmoji] = useState('📁');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAutoFillModal, setShowAutoFillModal] = useState(false);
  const [showSpinningWheel, setShowSpinningWheel] = useState(false);
  const wheelCanvasRef    = React.useRef(null);
  const wheelAudioCtxRef  = React.useRef(null);
  const wheelRafRef       = React.useRef(null);
  const wheelDegRef       = React.useRef(0);
  const wheelTargetRef    = React.useRef(0);
  const wheelStartTimeRef = React.useRef(null);
  const wheelLastSegRef   = React.useRef(0);
  const settingsLoadedRef = React.useRef(false);
  const dataLoadedRef = React.useRef(false);
  const [wheelSpinning,      setWheelSpinning]      = useState(false);
  const [wheelDone,          setWheelDone]          = useState(false);
  const [wheelPointerBounce, setWheelPointerBounce] = useState(false);
  const [wheelShimmer,       setWheelShimmer]       = useState(false);
  const [showRecipeSelector, setShowRecipeSelector] = useState(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showMealsTip, setShowMealsTip] = useState(() => localStorage.getItem('mealsTipDismissed') !== 'true');
  const [showMealPlanShare, setShowMealPlanShare] = useState(false);
  const [generatingCard, setGeneratingCard] = useState(false);
  const [follows, setFollows] = useState(new Set()); // set of user_ids we follow
  const [followers, setFollowers] = useState([]); // people who follow you: [{user_id, username, avatar_url}]
  const [followingList, setFollowingList] = useState([]); // people you follow: [{user_id, username, avatar_url}]
  const [showFollowModal, setShowFollowModal] = useState(null); // 'followers' | 'following' | null
  const [followedRecipes, setFollowedRecipes] = useState([]); // recipes from followed users
  const [showFindPeople, setShowFindPeople] = useState(false);
  const [peopleSearch, setPeopleSearch] = useState('');
  const [peopleResults, setPeopleResults] = useState([]);
  const [searchingPeople, setSearchingPeople] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null); // public profile to view
  const [communityFilter, setCommunityFilter] = useState('all'); // 'all' | 'following'
  const [communitySubView, setCommunitySubView] = useState('feed'); // 'feed' | 'recipes'
  const [household, setHousehold] = useState(null); // {id, owner_id, invite_code}
  const [householdMembers, setHouseholdMembers] = useState([]); // [{user_id, email}]
  const [showHouseholdModal, setShowHouseholdModal] = useState(false);
  const [householdToast, setHouseholdToast] = useState('');
  const [joiningHousehold, setJoiningHousehold] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeBookTab, setRecipeBookTab] = useState('mybook'); // 'mybook' | 'discover'
  const [discoverCollection, setDiscoverCollection] = useState(null); // selected collection
  const [discoverRecipe, setDiscoverRecipe] = useState(null); // viewing a discover recipe
  const [communitySearch, setCommunitySearch] = useState('');
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showEditRecipeModal, setShowEditRecipeModal] = useState(null);
  const [autoFillWarning, setAutoFillWarning] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const dragItem = React.useRef(null);
  const dragOverItem = React.useRef(null);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState('url'); // 'url' | 'loading' | 'review'
  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState('');
  const [importedRecipe, setImportedRecipe] = useState(null);
  const [importFolderIds, setImportFolderIds] = useState([]);
  const [importImageFile, setImportImageFile] = useState(null);
  const [importImagePreview, setImportImagePreview] = useState(null);
  const [importMode, setImportMode] = useState('url');
  const [showAddToCalendar, setShowAddToCalendar] = useState(null);
  const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
  const [userRecipes, setUserRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState(new Set());
  const [userRatings, setUserRatings] = useState({}); // {recipeId: {rating: 1-5, ratedAt: timestamp}}
  const [communityRatings, setCommunityRatings] = useState({
    // Sample community ratings for community recipes
    101: {avg: 4.6, count: 24},
    102: {avg: 4.8, count: 31}, 
    103: {avg: 4.3, count: 19},
    104: {avg: 4.9, count: 42},
    105: {avg: 4.5, count: 28},
    // Sample ratings for some user recipes too
    7: {avg: 4.7, count: 15},
    8: {avg: 4.4, count: 23},
    11: {avg: 4.6, count: 18},
    19: {avg: 4.9, count: 31}
  }); // {recipeId: {avg: 4.5, count: 12}}
  const [showRatingModal, setShowRatingModal] = useState(null); // recipe to rate
  const [recipeImagePreview, setRecipeImagePreview] = useState(null);
  const [draggedMeal, setDraggedMeal] = useState(null);
  const [recipeFilters, setRecipeFilters] = useState({cookTime:'all',mealType:'all',tried:'all',author:'all'});
  const [autoFillSettings, setAutoFillSettings] = useState({easyMeals:3,communityMeals:2,untriedRecipes:2,budgetMeals:0});
  const allCommunityRecipes = []; // shared_recipes feature removed
  const [recipeCostCache, setRecipeCostCache] = useState({}); // { recipeId: costPerServing }
  const [mealTypeSettings, setMealTypeSettings] = useState({
    0:{breakfast:true,lunch:true,dinner:true},
    1:{breakfast:true,lunch:true,dinner:true},
    2:{breakfast:true,lunch:true,dinner:true},
    3:{breakfast:true,lunch:true,dinner:true},
    4:{breakfast:true,lunch:true,dinner:true},
    5:{breakfast:true,lunch:true,dinner:true},
    6:{breakfast:true,lunch:true,dinner:true}
  });
  const [disabledSlots, setDisabledSlots] = useState({});
  const [mealPlan, setMealPlan] = useState(emptyMealPlan);
  const [weekStartDate, setWeekStartDate] = useState(null);

  const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const mealTypes = ['breakfast','lunch','dinner'];

  // ── Star Rating Component ──
  const StarRating = ({ rating, size = 16, interactive = false, onRate = null, color = '#fbbf24' }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const stars = [1,2,3,4,5];
    return (
      <div style={{display:'flex',gap:'2px',alignItems:'center'}} onMouseLeave={() => setHoverRating(0)}>
        {stars.map(star => {
          const filled = interactive ? (hoverRating >= star || (!hoverRating && rating >= star)) : rating >= star;
          return (
            <span key={star}
              onClick={() => interactive && onRate && onRate(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              style={{fontSize:`${size}px`,cursor:interactive?'pointer':'default',color:filled?color:'#4a4030',transition:'color 0.1s',userSelect:'none'}}>
              ★
            </span>
          );
        })}
      </div>
    );
  };

  // ── Rating Display (avg + count) ──
  const RatingDisplay = ({ recipeId, compact = false }) => {
    const communityRating = communityRatings[recipeId];
    const userRating = userRatings[recipeId];
    if (!communityRating && !userRating) return null;
    return (
      <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:compact?'11px':'12px'}}>
        <StarRating rating={communityRating?.avg || userRating?.rating || 0} size={compact?12:14} />
        {communityRating && (
          <span style={{color:'#9a9080',fontWeight:600}}>
            {communityRating.avg.toFixed(1)} ({communityRating.count})
          </span>
        )}
      </div>
    );
  };



  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // ── Auto-trigger Kroger cart add after OAuth callback ──
  useEffect(() => {
    // Check both localStorage (post-redirect) and sessionStorage
    const shouldAddToCart = localStorage.getItem('kroger_add_to_cart') || sessionStorage.getItem('kroger_add_to_cart');
    const krogerToken = localStorage.getItem('kroger_access_token') || sessionStorage.getItem('kroger_access_token');
    const pendingIngredients = localStorage.getItem('kroger_pending_ingredients') || sessionStorage.getItem('kroger_pending_ingredients');
    if (shouldAddToCart && krogerToken && pendingIngredients) {
      localStorage.removeItem('kroger_add_to_cart');
      sessionStorage.removeItem('kroger_add_to_cart');
      // Promote to sessionStorage for use during this session
      sessionStorage.setItem('kroger_access_token', krogerToken);
      localStorage.removeItem('kroger_access_token');
      setShowShoppingList(true);
      const ingredients = JSON.parse(pendingIngredients);
      sessionStorage.removeItem('kroger_pending_ingredients');
      setTimeout(async () => {
        try {

          // Get locationId from saved zip
          let locationId = null;
          const zip = localStorage.getItem('kroger_zip') || sessionStorage.getItem('kroger_zip');

          if (zip) {
            const cached = sessionStorage.getItem(`kroger_location_${zip}`);
            if (cached) {
              locationId = cached;
            } else {
              try {
                const KROGER_CLIENT_ID = 'thereciperoulette-bbcc09pc';
                const creds = btoa(`${KROGER_CLIENT_ID}:KIJMvRMbsD0cf19lnsiU06SCp3pzlh0-_3eofy1K`);
                const tokenRes = await fetch('https://reciperoulette.io/api/kroger-token', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ grant_type: 'client_credentials', scope: 'product.compact' })
                });
                const tokenData = await tokenRes.json();
                const locRes = await fetch('https://reciperoulette.io/api/kroger-proxy', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ path: `/v1/locations?filter.zipCode=${zip}&filter.limit=1`, method: 'GET', token: tokenData.access_token })
                });
                const locData = await locRes.json();
                locationId = locData?.data?.[0]?.locationId || null;
                if (locationId) sessionStorage.setItem(`kroger_location_${zip}`, locationId);
              } catch (e) {
              }
            }
          }

          const locationParam = locationId ? `&filter.locationId=${locationId}` : '';
          const cartItems = [];
          for (const ingredient of ingredients.slice(0, 50)) {
            const groceryPrefStr = (profile.groceryPrefs || []).join(' ');
            const searchTerm = groceryPrefStr ? `${groceryPrefStr} ${ingredient.name}` : ingredient.name;
            const sr = await fetch('https://reciperoulette.io/api/kroger-proxy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ path: `/v1/products?filter.term=${encodeURIComponent(searchTerm)}&filter.limit=1${locationParam}`, method: 'GET', token: krogerToken })
            });
            const sd = await sr.json();
            const product = sd?.data?.[0];
            if (product) cartItems.push({ upc: product.upc, quantity: ingredient.count || 1, modality: 'PICKUP' });
          }

          if (cartItems.length > 0) {
            const cartRes = await fetch('https://reciperoulette.io/api/kroger-proxy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ path: '/v1/cart/add', method: 'PUT', token: krogerToken, body: { items: cartItems } })
            });
            const cartData = await cartRes.json().catch(() => ({}));
            window.location.href = 'https://www.kroger.com/cart';
          } else {
          }
        } catch (e) {
          sessionStorage.removeItem('kroger_access_token');
          localStorage.removeItem('kroger_access_token');
        }
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (guestMode) {
      setFolders([
        {id:'f1', name:'House Favorites', emoji:'🏠', recipes:[3,6,8,11,12,13,14,15,19]},
        {id:'f2', name:'Crock Pot Favorites', emoji:'🍲', recipes:[11,12,13,14]},
        {id:'f3', name:'Kid Friendly', emoji:'👶', recipes:[2,8,10,11,14,15,16]},
        {id:'f4', name:'Whole 30 Approved', emoji:'💪', recipes:[1,4,5,9,10,17,18,20]},
        {id:'f5', name:'Quick Weeknight', emoji:'⚡', recipes:[2,4,7,8,9,10,17,18]},
        {id:'f6', name:'Date Night', emoji:'🕯️', recipes:[6,9,18,19,20]}
      ]);
    } else {
      setFolders([{id:'f1', name:'House Favorites', emoji:'🏠', recipes:[]}]);
    }
  }, [guestMode]);

  useEffect(() => {
    if (session?.user && !dataLoadedRef.current) {
      dataLoadedRef.current = true;
      loadUserData(session.user.id);
      if (pendingJoinCode) {
        setShowHouseholdModal(true);
      }
    }
  }, [session]);

  const loadHousehold = async (userId) => {
    // Check if user is a member of any household
    const { data: membership } = await supabase.from('household_members').select('household_id').eq('user_id', userId).single();
    if (!membership) return null;
    const { data: hh } = await supabase.from('households').select('*').eq('id', membership.household_id).single();
    if (!hh) return null;
    setHousehold(hh);
    // Load all members
    const { data: members } = await supabase.from('household_members').select('user_id').eq('household_id', hh.id);
    setHouseholdMembers(members || []);
    return hh;
  };

  const loadUserData = async (userId) => {
    const hh = await loadHousehold(userId);
    const hhId = hh?.id;

    // Build queries
    let mealsQuery = supabase.from('meal_plans').select('*');
    let recipesQuery = supabase.from('user_recipes').select('*');
    if (hhId) {
      const { data: members } = await supabase.from('household_members').select('user_id').eq('household_id', hhId);
      const memberIds = members ? members.map(m => m.user_id) : [userId];
      mealsQuery = mealsQuery.in('user_id', memberIds);
      recipesQuery = recipesQuery.in('user_id', memberIds);
    } else {
      mealsQuery = mealsQuery.eq('user_id', userId);
      recipesQuery = recipesQuery.eq('user_id', userId);
    }

    // Fire all independent queries in parallel
    const [
      { data: meals },
      { data: recipes },
      { data: prof },
      { data: followData },
      { data: saved },
      { data: ratings },
      { data: communityRatingsData },
    ] = await Promise.all([
      mealsQuery,
      recipesQuery,
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('follows').select('following_id').eq('follower_id', userId),
      supabase.from('saved_recipes').select('recipe_id').eq('user_id', userId),
      supabase.from('recipe_ratings').select('*').eq('user_id', userId),
      supabase.from('recipe_ratings').select('recipe_id, rating'),
    ]);
    let loadedRecipes = recipes ? recipes.map(r => r.recipe) : [];

    if (meals && meals.length > 0) {
      const plan = JSON.parse(JSON.stringify(emptyMealPlan));

      // Current week boundaries — keep ALL meals within the current week visible
      const now = new Date(); now.setHours(0,0,0,0);
      const dayOfWeek = now.getDay(); // 0=Sun
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - dayOfWeek);
      currentWeekStart.setHours(0,0,0,0);
      const currentWeekStartStr = currentWeekStart.toISOString().split('T')[0];

      const prevWeekMealRecipeIds = new Set();
      const prevWeekIds = [];

      meals.forEach(m => {
        const wsd = m.week_start_date;
        if (wsd && wsd < currentWeekStartStr) {
          // Meal is from a PREVIOUS week — archive it
          if (m.recipe?.id) prevWeekMealRecipeIds.add(m.recipe.id);
          prevWeekIds.push(m.id);
          return;
        }
        // Meal is from current week — always show it regardless of day
        if (plan[m.day_index]) plan[m.day_index][m.meal_type] = m.recipe;
      });

      // Auto-increment timesMade for previous week's meals
      if (prevWeekMealRecipeIds.size > 0) {
        loadedRecipes = loadedRecipes.map(r => {
          if (prevWeekMealRecipeIds.has(r.id)) {
            const updated = {...r, timesMade: (r.timesMade || 0) + 1};
            supabase.from('user_recipes').update({recipe: updated}).eq('user_id', userId).eq('recipe->>id', r.id);
            return updated;
          }
          return r;
        });
        // Remove previous week's meals from DB
        if (prevWeekIds.length > 0) {
          await supabase.from('meal_plans').delete().in('id', prevWeekIds);
        }
      }

      setMealPlan(plan);
      if (meals[0]?.week_start_date) setWeekStartDate(meals[0].week_start_date);
    }

    setUserRecipes(loadedRecipes);

    // Apply parallel results
    if (followData) {
      const followedIds = followData.map(f => f.following_id);
      setFollows(new Set(followedIds));
      if (followedIds.length > 0) {
        const [{ data: friendRecipes }, { data: followingProfiles }] = await Promise.all([
          supabase.from('user_recipes').select('recipe, user_id').in('user_id', followedIds),
          supabase.from('user_profiles_public').select('user_id, username, avatar_url').in('user_id', followedIds),
        ]);
        if (friendRecipes) setFollowedRecipes(friendRecipes.map(r => ({ ...r.recipe, _followedUserId: r.user_id })));
        if (followingProfiles) setFollowingList(followingProfiles);
      }
      // Load people who follow you
      const { data: followerData } = await supabase.from('follows').select('follower_id').eq('following_id', userId);
      if (followerData && followerData.length > 0) {
        const followerIds = followerData.map(f => f.follower_id);
        const { data: followerProfiles } = await supabase.from('user_profiles_public').select('user_id, username, avatar_url').in('user_id', followerIds);
        if (followerProfiles) setFollowers(followerProfiles);
      }
    }
    if (saved) setSavedRecipes(new Set(saved.map(r => r.recipe_id)));

    // Upsert public profile (fire and forget)
    if (prof?.display_name) {
      supabase.from('user_profiles_public').upsert({
        user_id: userId,
        username: prof.display_name,
        avatar_url: prof.avatar_url || '',
        recipe_count: loadedRecipes.length
      }, { onConflict: 'user_id' });
    }

    if (prof) {
      setProfile({
        displayName: prof.display_name || '',
        phone: prof.phone || '',
        zipCode: prof.zip_code || '',
        avatarUrl: prof.avatar_url || '',
        avatarPreview: prof.avatar_url || '',
        dietaryPrefs: prof.dietary_prefs || [],
        groceryPrefs: prof.grocery_prefs || [],
        householdSize: (prof.adults || 2) + (prof.children || 0), adults: prof.adults ?? 2, children: prof.children ?? 0
      });
      // Restore meal planning settings
      if (prof.meal_type_settings) { setMealTypeSettings(prof.meal_type_settings);
        // Derive disabledSlots from mealTypeSettings so they stay in sync
        const derived = {};
        Object.entries(prof.meal_type_settings).forEach(([d, meals]) => {
          Object.entries(meals).forEach(([mt, on]) => { if (!on) derived[`${d}-${mt}`] = true; });
        });
        setDisabledSlots(derived);
      }
      settingsLoadedRef.current = true;
      // Load saved folders
      if (prof.folders && Array.isArray(prof.folders) && prof.folders.length > 0) {
        setFolders(prof.folders);
      }
      if (!prof.onboarding_complete) {
        setShowOnboarding(true);
        setOnboardingStep(1);
      }
    } else {
      // Brand new user — no profile yet
      setShowOnboarding(true);
      setOnboardingStep(1);
      settingsLoadedRef.current = true;
    }
    setLoadingProfile(false);

    // Apply ratings (already loaded in parallel)
    if (ratings) {
      const ratingsMap = {};
      ratings.forEach(r => { ratingsMap[r.recipe_id] = {rating: r.rating, ratedAt: r.created_at}; });
      setUserRatings(ratingsMap);
    }

    // Apply community ratings (loaded in parallel)
    if (communityRatingsData) {
      const ratingsMap = {};
      communityRatingsData.forEach(r => {
        if (!ratingsMap[r.recipe_id]) ratingsMap[r.recipe_id] = {total: 0, count: 0};
        ratingsMap[r.recipe_id].total += r.rating;
        ratingsMap[r.recipe_id].count += 1;
      });
      const avgRatings = {};
      Object.keys(ratingsMap).forEach(rid => {
        avgRatings[rid] = {
          avg: ratingsMap[rid].total / ratingsMap[rid].count,
          count: ratingsMap[rid].count
        };
      });
      setCommunityRatings(avgRatings);
    }
  };

  const saveRating = async (recipeId, rating) => {
    if (!session?.user) return;
    const userId = session.user.id;
    await supabase.from('recipe_ratings').upsert({
      user_id: userId,
      recipe_id: recipeId,
      rating,
      created_at: new Date().toISOString()
    }, {onConflict: 'user_id,recipe_id'});
    setUserRatings(prev => ({...prev, [recipeId]: {rating, ratedAt: new Date().toISOString()}}));
    // Reload community ratings after user rates
    const { data: communityRatings } = await supabase.from('recipe_ratings').select('recipe_id, rating');
    if (communityRatings) {
      const ratingsMap = {};
      communityRatings.forEach(r => {
        if (!ratingsMap[r.recipe_id]) ratingsMap[r.recipe_id] = {total: 0, count: 0};
        ratingsMap[r.recipe_id].total += r.rating;
        ratingsMap[r.recipe_id].count += 1;
      });
      const avgRatings = {};
      Object.keys(ratingsMap).forEach(rid => {
        avgRatings[rid] = {
          avg: ratingsMap[rid].total / ratingsMap[rid].count,
          count: ratingsMap[rid].count
        };
      });
      setCommunityRatings(avgRatings);
    }
    setShowRatingModal(null);
  };

  const saveProfile = async () => {
    if (!session?.user) return;
    setProfileSaving(true);
    const userId = session.user.id;
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      display_name: profile.displayName,
      phone: profile.phone,
      zip_code: profile.zipCode,
      avatar_url: profile.avatarPreview,
      dietary_prefs: profile.dietaryPrefs,
      grocery_prefs: profile.groceryPrefs,
      household_size: profile.householdSize,
      adults: profile.adults,
      children: profile.children,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) {
      console.error('Profile save error:', error);
    }
    // Reload profile from DB to confirm it saved
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (prof) {
      setProfile({
        displayName: prof.display_name || '',
        phone: prof.phone || '',
        avatarUrl: prof.avatar_url || '',
        avatarPreview: prof.avatar_url || '',
        dietaryPrefs: prof.dietary_prefs || [],
        groceryPrefs: prof.grocery_prefs || [],
        householdSize: (prof.adults || 2) + (prof.children || 0), adults: prof.adults ?? 2, children: prof.children ?? 0
      });
    }
    setProfileSaving(false);
    setProfileSaved(true);
    setTimeout(() => { setProfileSaved(false); setShowProfilePanel(false); }, 1500);
  };

  const createHousehold = async () => {
    if (!session?.user) return;
    const userId = session.user.id;
    const hhId = Math.random().toString(36).slice(2, 10);
    const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    await supabase.from('households').insert({ id: hhId, owner_id: userId, invite_code: inviteCode });
    await supabase.from('household_members').insert({ household_id: hhId, user_id: userId });
    const newHH = { id: hhId, owner_id: userId, invite_code: inviteCode };
    setHousehold(newHH);
    setHouseholdMembers([{ user_id: userId }]);
    return newHH;
  };

  const joinHousehold = async (inviteCode) => {
    if (!session?.user) return null;
    const userId = session.user.id;
    // Find household by invite code
    const { data: hh } = await supabase.from('households').select('*').eq('invite_code', inviteCode.toUpperCase().trim()).single();
    if (!hh) return 'not_found';
    // Check member count
    const { data: members } = await supabase.from('household_members').select('user_id').eq('household_id', hh.id);
    if (members && members.length >= 4) return 'full';
    if (members && members.find(m => m.user_id === userId)) return 'already_member';
    // Join
    await supabase.from('household_members').insert({ household_id: hh.id, user_id: userId });
    setHousehold(hh);
    setHouseholdMembers([...(members || []), { user_id: userId }]);
    // Reload shared data
    await loadUserData(userId);
    return 'success';
  };

  const leaveHousehold = async () => {
    if (!session?.user || !household) return;
    const userId = session.user.id;
    await supabase.from('household_members').delete().eq('household_id', household.id).eq('user_id', userId);
    // If owner and no members left, delete household
    if (household.owner_id === userId && householdMembers.length <= 1) {
      await supabase.from('households').delete().eq('id', household.id);
    }
    setHousehold(null);
    setHouseholdMembers([]);
    await loadUserData(userId);
  };

  const copyInviteLink = async () => {
    if (!household) return;
    const url = `${window.location.origin}${window.location.pathname}?join=${household.invite_code}`;
    await navigator.clipboard.writeText(url);
    setHouseholdToast('copied');
    setTimeout(() => setHouseholdToast(''), 2500);
  };

  const searchPeople = async (query) => {
    if (!query.trim()) { setPeopleResults([]); return; }
    setSearchingPeople(true);
    // Search by username or phone
    const { data } = await supabase.from('user_profiles_public')
      .select('*')
      .or(`username.ilike.%${query}%,phone.ilike.%${query}%`)
      .neq('user_id', session?.user?.id)
      .limit(20);
    setPeopleResults(data || []);
    setSearchingPeople(false);
  };

  const followUser = async (targetUserId) => {
    if (!session?.user) return;
    const userId = session.user.id;
    await supabase.from('follows').insert({ follower_id: userId, following_id: targetUserId });
    setFollows(prev => new Set([...prev, targetUserId]));
    // Load their recipes
    const { data: friendRecipes } = await supabase.from('user_recipes').select('recipe, user_id').eq('user_id', targetUserId);
    if (friendRecipes) setFollowedRecipes(prev => [...prev, ...friendRecipes.map(r => ({ ...r.recipe, _followedUserId: r.user_id }))]);
    // Increment follower count
    await supabase.rpc('increment_follower_count', { target_user_id: targetUserId }).catch(() => {});
  };

  const unfollowUser = async (targetUserId) => {
    if (!session?.user) return;
    await supabase.from('follows').delete().eq('follower_id', session.user.id).eq('following_id', targetUserId);
    setFollows(prev => { const n = new Set(prev); n.delete(targetUserId); return n; });
    setFollowedRecipes(prev => prev.filter(r => r._followedUserId !== targetUserId));
  };

  const toggleFollow = async (targetUserId) => {
    if (follows.has(targetUserId)) await unfollowUser(targetUserId);
    else await followUser(targetUserId);
  };

  const getDayDate = (dayIndex) => {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0,0,0,0);
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + dayIndex);
    return d;
  };

  const formatDayDate = (dayIndex) => {
    const d = getDayDate(dayIndex);
    return `${d.getMonth()+1}/${d.getDate()}`;
  };

  const isToday = (dayIndex) => {
    const d = getDayDate(dayIndex);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - day);
    sunday.setHours(0,0,0,0);
    return sunday.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const saveMealPlan = async (newPlan) => {
    if (!session?.user) return;
    setSaving(true);
    const userId = session.user.id;
    const wsd = getWeekStart();
    setWeekStartDate(wsd);
    await supabase.from('meal_plans').delete().eq('user_id', userId);
    const rows = [];
    for (let d = 0; d < 7; d++) {
      for (const mt of mealTypes) {
        if (newPlan[d][mt]) rows.push({user_id:userId,day_index:d,meal_type:mt,recipe:newPlan[d][mt],week_start_date:wsd});
      }
    }
    if (rows.length > 0) await supabase.from('meal_plans').insert(rows);
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMealPlan(emptyMealPlan);
    setUserRecipes([]);
    setSavedRecipes(new Set());
  };

  const saveFolders = async (newFolders) => {
    if (!session?.user) return;
    await supabase.from('profiles').upsert({ id: session.user.id, folders: newFolders }, { onConflict: 'id' });
  };

  const updateFolders = (updater) => {
    setFolders(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveFolders(next);
      return next;
    });
  };

  const removeMealFromPlan = (dayIndex, mealType) => {
    const newPlan = {...mealPlan,[dayIndex]:{...mealPlan[dayIndex],[mealType]:null}};
    setMealPlan(newPlan);
    saveMealPlan(newPlan);
  };

  const addMealToPlan = (dayIndex, mealType, recipe) => {
    const newPlan = {...mealPlan,[dayIndex]:{...mealPlan[dayIndex],[mealType]:recipe}};
    setMealPlan(newPlan);
    setShowRecipeSelector(null);
    saveMealPlan(newPlan);
  };

  const clearAllMeals = () => { setMealPlan(emptyMealPlan); saveMealPlan(emptyMealPlan); };

  const isSlotDisabled = (d, mt) => disabledSlots[`${d}-${mt}`] || false;

  const toggleSlotDisabled = (d, mt) => {
    const key = `${d}-${mt}`;
    if (!disabledSlots[key]) removeMealFromPlan(d, mt);
    setDisabledSlots(prev => ({...prev,[key]:!prev[key]}));
  };

  const handleDragStart = (e, d, mt, recipe) => {
    setDraggedMeal({d, mt, recipe});
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = e => e.preventDefault();
  const handleDrop = (e, td, tmt) => {
    e.preventDefault();
    if (!draggedMeal || isSlotDisabled(td, tmt)) return;
    const newPlan = JSON.parse(JSON.stringify(mealPlan));
    newPlan[draggedMeal.d][draggedMeal.mt] = null;
    newPlan[td][tmt] = draggedMeal.recipe;
    setMealPlan(newPlan);
    saveMealPlan(newPlan);
    setDraggedMeal(null);
  };

  // Touch-based drag for mobile
  const touchDragRef = React.useRef(null);
  const handleTouchStart = (e, d, mt, recipe) => {
    touchDragRef.current = {d, mt, recipe, startX: e.touches[0].clientX, startY: e.touches[0].clientY, moved: false};
  };
  const handleTouchMove = (e) => {
    if (!touchDragRef.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchDragRef.current.startX);
    const dy = Math.abs(e.touches[0].clientY - touchDragRef.current.startY);
    if (dx > 5 || dy > 5) {
      touchDragRef.current.moved = true;
      e.preventDefault();
    }
    setDraggedMeal({...touchDragRef.current});
  };
  const handleTouchEnd = (e) => {
    if (!touchDragRef.current || !touchDragRef.current.moved) {
      touchDragRef.current = null;
      setDraggedMeal(null);
      return;
    }
    const dragged = touchDragRef.current;
    touchDragRef.current = null;
    setDraggedMeal(null);
    // Find which drop zone the finger is over
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;
    const dropZone = el.closest('[data-dropzone]');
    if (!dropZone) return;
    const td = parseInt(dropZone.dataset.day);
    const tmt = dropZone.dataset.meal;
    if (isNaN(td) || !tmt) return;
    if (isSlotDisabled(td, tmt) || (dragged.d === td && dragged.mt === tmt)) return;
    const newPlan = JSON.parse(JSON.stringify(mealPlan));
    newPlan[dragged.d][dragged.mt] = null;
    newPlan[td][tmt] = dragged.recipe;
    setMealPlan(newPlan);
    saveMealPlan(newPlan);
  };

  const saveCommunityRecipe = async (recipe) => {
    if (!session?.user || savedRecipes.has(recipe.id)) return;
    const newRecipe = {...recipe, timesMade:0};
    if (!userRecipes.find(r => r.id === recipe.id)) {
      setUserRecipes(prev => [...prev, newRecipe]);
      await supabase.from('user_recipes').insert({user_id:session.user.id, recipe:newRecipe});
    }
    setSavedRecipes(prev => new Set([...prev, recipe.id]));
    await supabase.from('saved_recipes').insert({user_id:session.user.id, recipe_id:recipe.id});
  };

  const wheelSegments = [
    { label: '🍝 Pasta',     color: '#ff6b6b', glow: 'rgba(255,107,107,0.8)' },
    { label: '🥗 Salad',     color: '#51cf66', glow: 'rgba(81,207,102,0.8)'  },
    { label: '🍗 Chicken',   color: '#fcc419', glow: 'rgba(252,196,25,0.8)'  },
    { label: '🐟 Seafood',   color: '#339af0', glow: 'rgba(51,154,240,0.8)'  },
    { label: '🌮 Tacos',     color: '#ff922b', glow: 'rgba(255,146,43,0.8)'  },
    { label: '🥘 Slow Cook', color: '#cc5de8', glow: 'rgba(204,93,232,0.8)'  },
    { label: '🍳 Breakfast', color: '#20c997', glow: 'rgba(32,201,151,0.8)'  },
    { label: '🥩 Protein',   color: '#f06595', glow: 'rgba(240,101,149,0.8)' },
  ];
  const WHEEL_NUM = wheelSegments.length;
  const WHEEL_ANGLE = 360 / WHEEL_NUM;
  const WHEEL_SIZE = 300;
  const WHEEL_R = WHEEL_SIZE / 2;

  const drawWheelCanvas = React.useCallback((canvas, rotateDeg) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = WHEEL_R, cy = WHEEL_R;
    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);
    wheelSegments.forEach((seg, i) => {
      const startAngle = ((i * WHEEL_ANGLE - 90 + rotateDeg) * Math.PI) / 180;
      const endAngle   = (((i + 1) * WHEEL_ANGLE - 90 + rotateDeg) * Math.PI) / 180;
      const midAngle   = ((i * WHEEL_ANGLE + WHEEL_ANGLE / 2 - 90 + rotateDeg) * Math.PI) / 180;
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, WHEEL_R - 10);
      grad.addColorStop(0, '#1a1a2e'); grad.addColorStop(0.6, '#16213e'); grad.addColorStop(1, seg.color + '22');
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, WHEEL_R - 8, startAngle, endAngle); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + (WHEEL_R - 8) * Math.cos(startAngle), cy + (WHEEL_R - 8) * Math.sin(startAngle));
      ctx.strokeStyle = seg.color + '55'; ctx.lineWidth = 1; ctx.shadowColor = seg.glow; ctx.shadowBlur = 6; ctx.stroke(); ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(cx, cy, WHEEL_R - 14, startAngle, endAngle);
      ctx.strokeStyle = seg.color; ctx.lineWidth = 3; ctx.shadowColor = seg.glow; ctx.shadowBlur = 14; ctx.stroke(); ctx.shadowBlur = 0;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(midAngle); ctx.textAlign = 'right';
      ctx.font = 'bold 11px system-ui'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 4;
      ctx.fillText(seg.label, WHEEL_R - 20, 4); ctx.shadowBlur = 0; ctx.restore();
    });
    const rimGrad = ctx.createLinearGradient(0, 0, WHEEL_SIZE, WHEEL_SIZE);
    rimGrad.addColorStop(0, 'rgba(255,255,255,0.18)'); rimGrad.addColorStop(0.5, 'rgba(255,255,255,0.05)'); rimGrad.addColorStop(1, 'rgba(255,255,255,0.18)');
    ctx.beginPath(); ctx.arc(cx, cy, WHEEL_R - 6, 0, Math.PI * 2); ctx.strokeStyle = rimGrad; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 44, 0, Math.PI * 2); ctx.fillStyle = '#0a0a0a'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1.5; ctx.stroke();
  }, []);


  // ── Auto-fill helpers ────────────────────────────────────────────────────
  const isBreakfastAppropriate = (recipe) => {
    const name = (recipe.name || '').toLowerCase();
    const tags = (recipe.tags || []).map(t => t.toLowerCase());
    const ingredients = (recipe.ingredients || []).map(i => (typeof i === 'string' ? i : i.name || '').toLowerCase());

    // Explicit breakfast tags = always OK
    if (tags.some(t => ['breakfast','brunch','morning'].includes(t))) return true;

    // Explicitly dinner/lunch tagged with no breakfast tag = not OK
    if (tags.some(t => ['dinner','lunch'].includes(t)) && !tags.some(t => t === 'breakfast')) return false;

    // Heavy dinner proteins/dishes = not OK for breakfast
    const dinnerKeywords = ['steak','ribeye','brisket','pot roast','ribs','pork chop','lamb',
      'chili','tacos','tikka','masala','curry','pasta','lasagna','pizza','stir fry','fried rice',
      'salmon','shrimp','scallop','lobster','crab','burger','meatball','meatloaf',
      'beef','taco','burrito','enchilada','soup','chowder','ramen','pho','risotto'];
    if (dinnerKeywords.some(k => name.includes(k) || ingredients.some(i => i.includes(k)))) return false;

    // Light/neutral dishes OK for breakfast
    const breakfastKeywords = ['egg','oat','pancake','waffle','toast','smoothie','yogurt',
      'granola','muffin','bagel','cereal','fruit','avocado','acai','overnight oats','frittata',
      'scramble','hash','quiche','crepe','porridge'];
    if (breakfastKeywords.some(k => name.includes(k) || ingredients.some(i => i.includes(k)))) return true;

    // Default: bowl/salad/grain dishes = fine, otherwise skip for breakfast
    const neutralKeywords = ['bowl','salad','quinoa','wrap','sandwich'];
    return neutralKeywords.some(k => name.includes(k));
  };

  const matchesDietaryPrefs = (recipe, prefs) => {
    if (!prefs || prefs.length === 0) return true;
    const name = (recipe.name || '').toLowerCase();
    const tags = (recipe.tags || []).map(t => t.toLowerCase());
    const ingredients = (recipe.ingredients || []).map(i => (typeof i === 'string' ? i : i.name || '').toLowerCase());
    const allText = [...tags, name, ...ingredients];

    if (prefs.includes('vegetarian') || prefs.includes('vegan')) {
      const meatKeywords = ['chicken','beef','pork','lamb','turkey','bacon','ham','sausage',
        'steak','shrimp','salmon','tuna','scallop','lobster','crab','anchovy','prosciutto',
        'pepperoni','salami','ground meat','ground turkey','ground beef'];
      if (meatKeywords.some(k => allText.some(t => t.includes(k)))) return false;
    }
    if (prefs.includes('vegan')) {
      const dairyEggKeywords = ['cheese','milk','cream','butter','egg','yogurt','honey',
        'parmesan','mozzarella','cheddar','feta','gruyere','whey','ghee'];
      if (dairyEggKeywords.some(k => allText.some(t => t.includes(k)))) return false;
    }
    if (prefs.includes('gluten-free')) {
      const glutenKeywords = ['pasta','bread','flour','breadcrumb','soy sauce','tortilla',
        'pita','naan','couscous','barley','rye','wheat','panko','crouton','beer'];
      if (glutenKeywords.some(k => allText.some(t => t.includes(k)))) return false;
    }
    if (prefs.includes('dairy-free')) {
      const dairyKeywords = ['cheese','milk','cream','butter','yogurt','parmesan','mozzarella',
        'cheddar','feta','gruyere','ghee','half and half','heavy cream','sour cream'];
      if (dairyKeywords.some(k => allText.some(t => t.includes(k)))) return false;
    }
    if (prefs.includes('nut-free')) {
      const nutKeywords = ['almond','walnut','pecan','cashew','peanut','pistachio','hazelnut',
        'pine nut','macadamia','tahini','almond butter','peanut butter'];
      if (nutKeywords.some(k => allText.some(t => t.includes(k)))) return false;
    }
    return true;
  };

  const filterForSlot = (recipes, mealType, prefs) => {
    const dietFiltered = recipes.filter(r => matchesDietaryPrefs(r, prefs));
    if (mealType === 'breakfast') return dietFiltered.filter(isBreakfastAppropriate);
    // lunch/dinner: exclude explicit breakfast-only items
    return dietFiltered.filter(r => {
      const tags = (r.tags || []).map(t => t.toLowerCase());
      return !tags.includes('breakfast');
    });
  };

  const wheelEaseOut = t => 1 - Math.pow(1 - t, 4);

  const animateWheel = React.useCallback((ts) => {
    if (!wheelStartTimeRef.current) wheelStartTimeRef.current = ts;
    const elapsed  = ts - wheelStartTimeRef.current;
    const duration = 3200;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = wheelEaseOut(progress);
    const current  = wheelDegRef.current + (wheelTargetRef.current - wheelDegRef.current) * eased;
    const seg = Math.floor(((current % 360) + 360) / WHEEL_ANGLE) % WHEEL_NUM;
    if (seg !== wheelLastSegRef.current && wheelAudioCtxRef.current) {
      const actx = wheelAudioCtxRef.current;
      const osc = actx.createOscillator(); const gain = actx.createGain();
      osc.connect(gain); gain.connect(actx.destination);
      osc.frequency.value = 700 + Math.random() * 500; osc.type = 'sine';
      gain.gain.setValueAtTime(0.07, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.035);
      osc.start(actx.currentTime); osc.stop(actx.currentTime + 0.035);
      wheelLastSegRef.current = seg;
    }
    drawWheelCanvas(wheelCanvasRef.current, current);
    if (progress < 1) {
      wheelRafRef.current = requestAnimationFrame(animateWheel);
    } else {
      wheelDegRef.current = wheelTargetRef.current % 360;
      drawWheelCanvas(wheelCanvasRef.current, wheelDegRef.current);
      setWheelSpinning(false); setWheelShimmer(false); setWheelDone(true);
      setWheelPointerBounce(true);
      setTimeout(() => setWheelPointerBounce(false), 900);
      // Fill meals after wheel stops
      setTimeout(() => {
        setShowSpinningWheel(false); setWheelDone(false);
        const newPlan = JSON.parse(JSON.stringify(mealPlan));
        const myRecipes = guestMode ? [...sampleRecipes, ...userRecipes] : [...userRecipes];
        const all = [...myRecipes, ...allCommunityRecipes];
        const userPrefs = profile.dietaryPrefs || [];
        const empty = [];
        for (let d = 0; d < 7; d++) for (const mt of mealTypes)
          if (mealTypeSettings[d][mt] && !newPlan[d][mt] && !isSlotDisabled(d, mt)) empty.push({d, mt});
        const slots = empty.sort(() => Math.random() - 0.5);
        let i = 0;
        // Helper: pick best recipe for a slot from a filtered pool
        const pickForSlot = (pool, slot) => {
          const suitable = filterForSlot(pool, slot.mt, userPrefs);
          if (suitable.length === 0) return filterForSlot(all, slot.mt, userPrefs)[0] || pool[0];
          return suitable[Math.floor(Math.random() * suitable.length)];
        };
        const easy = all.filter(r => (r.cookTime + (parseInt(r.prepTime) || 0)) <= 30 || r.cookTime <= 30).sort(() => Math.random() - 0.5);
        for (let j = 0; j < autoFillSettings.easyMeals && i < slots.length; j++, i++) newPlan[slots[i].d][slots[i].mt] = pickForSlot(easy, slots[i]);
        const popular = [...allCommunityRecipes].sort((a,b) => b.likes - a.likes);
        for (let j = 0; j < autoFillSettings.communityMeals && i < slots.length; j++, i++) newPlan[slots[i].d][slots[i].mt] = pickForSlot(popular, slots[i]);
        const untried = myRecipes.filter(r => r.timesMade === 0).sort(() => Math.random() - 0.5);
        for (let j = 0; j < autoFillSettings.untriedRecipes && i < slots.length; j++, i++) newPlan[slots[i].d][slots[i].mt] = pickForSlot(untried, slots[i]);
        const budget = all.filter(r => recipeCostCache[r.id] !== undefined && recipeCostCache[r.id] <= 5).sort(() => Math.random() - 0.5);
        for (let j = 0; j < autoFillSettings.budgetMeals && i < slots.length; j++, i++) newPlan[slots[i].d][slots[i].mt] = pickForSlot(budget.length ? budget : all, slots[i]);
        // Fill any remaining empty slots from Recipe Book, repeating if needed
        if (i < slots.length) {
          const fallback = myRecipes.length > 0 ? myRecipes : all;
          let usedRepeats = false;
          while (i < slots.length) {
            const suitable = filterForSlot(fallback, slots[i].mt, userPrefs);
            const pool = suitable.length > 0 ? suitable : fallback;
            // Check if we're about to repeat something already in the plan
            const alreadyUsed = Object.values(newPlan).flatMap(day => Object.values(day)).filter(Boolean).map(r => r.id);
            const fresh = pool.filter(r => !alreadyUsed.includes(r.id));
            if (fresh.length === 0) usedRepeats = true;
            const pick = fresh.length > 0 ? fresh[Math.floor(Math.random() * fresh.length)] : pool[Math.floor(Math.random() * pool.length)];
            newPlan[slots[i].d][slots[i].mt] = pick;
            i++;
          }
          if (usedRepeats) {
            setAutoFillWarning('duplicate');
            setTimeout(() => setAutoFillWarning(''), 8000);
          }
        }
        setMealPlan(newPlan); saveMealPlan(newPlan);
      }, 1200);
    }
  }, [mealPlan, autoFillSettings, mealTypeSettings, drawWheelCanvas, profile]);

  useEffect(() => {
    if (showSpinningWheel && wheelCanvasRef.current) {
      drawWheelCanvas(wheelCanvasRef.current, wheelDegRef.current);
    }
  }, [showSpinningWheel, drawWheelCanvas]);

  // Auto-save meal planning settings to Supabase whenever they change
  useEffect(() => {
    if (!session?.user || guestMode || !settingsLoadedRef.current) return;
    const timer = setTimeout(async () => {
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        meal_type_settings: mealTypeSettings,
        disabled_slots: disabledSlots,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }, 800);
    return () => clearTimeout(timer);
  }, [mealTypeSettings, disabledSlots, session, guestMode]);

  const autoFillCalendar = () => {
    setShowAutoFillModal(false);
    setShowSpinningWheel(true);
    setWheelDone(false); setWheelSpinning(true); setWheelShimmer(true);
    wheelStartTimeRef.current = null; wheelLastSegRef.current = 0;
    wheelTargetRef.current = wheelDegRef.current + 1440 + Math.floor(Math.random() * 720);
    if (!wheelAudioCtxRef.current)
      wheelAudioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    setTimeout(() => { drawWheelCanvas(wheelCanvasRef.current, wheelDegRef.current); wheelRafRef.current = requestAnimationFrame(animateWheel); }, 50);
  };

  const filterRecipes = (recipes) => recipes.filter(r => {
    if (recipeFilters.cookTime === 'quick' && r.cookTime >= 20) return false;
    if (recipeFilters.cookTime === 'medium' && (r.cookTime < 20 || r.cookTime > 40)) return false;
    if (recipeFilters.cookTime === 'long' && r.cookTime <= 40) return false;
    if (recipeFilters.tried === 'tried' && r.timesMade === 0) return false;
    if (recipeFilters.tried === 'untried' && r.timesMade > 0) return false;
    if (recipeFilters.mealType !== 'all' && !r.tags?.some(t => t.toLowerCase() === recipeFilters.mealType)) return false;
    if (recipeFilters.author !== 'all' && r.author !== recipeFilters.author) return false;
    return true;
  });

  // Scale an ingredient string based on ratio
  const scaleIngredient = (ingredient, ratio) => {
    if (ratio === 1) return ingredient;
    // Match leading number/fraction like "1.5", "1/2", "2", "1 1/2"
    const fracPattern = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.?\d+)/;
    return ingredient.replace(fracPattern, (match) => {
      // Parse mixed fractions like "1 1/2"
      let val;
      if (match.includes(' ')) {
        const parts = match.trim().split(' ');
        const whole = parseFloat(parts[0]);
        const [n, d] = parts[1].split('/').map(Number);
        val = whole + n / d;
      } else if (match.includes('/')) {
        const [n, d] = match.split('/').map(Number);
        val = n / d;
      } else {
        val = parseFloat(match);
      }
      const scaled = val * ratio;
      // Format nicely
      if (Number.isInteger(scaled)) return String(scaled);
      // Try to express as a simple fraction
      const fracs = [[1/4,'1/4'],[1/3,'1/3'],[1/2,'1/2'],[2/3,'2/3'],[3/4,'3/4']];
      const whole = Math.floor(scaled);
      const rem = scaled - whole;
      const frac = fracs.find(([f]) => Math.abs(rem - f) < 0.08);
      if (frac) return whole > 0 ? `${whole} ${frac[1]}` : frac[1];
      return parseFloat(scaled.toFixed(2)).toString();
    });
  };

  const generateShoppingList = () => {
    const map = {};
    Object.values(mealPlan).forEach(day => Object.values(day).forEach(meal => {
      if (meal?.ingredients) {
        const ratio = meal.servings ? (profile.householdSize || 2) / meal.servings : 1;
        meal.ingredients.forEach(ing => {
          const scaled = scaleIngredient(ing, ratio);
          const k = scaled.toLowerCase().trim();
          map[k] = (map[k]||0)+1;
        });
      }
    }));
    const cats = {Produce:[],Proteins:[],Dairy:[],Pantry:[],Seasonings:[],Other:[]};
    const keys = {Produce:['tomato','cucumber','onion','pepper','broccoli','kale','avocado','lemon','basil','parsley','potato'],Proteins:['chicken','beef','shrimp','salmon','egg','tofu','pork','fish'],Dairy:['cheese','cream','milk','butter','yogurt','feta','parmesan'],Pantry:['rice','pasta','quinoa','bread','soy sauce','olive oil','honey','flour','sugar','wine'],Seasonings:['salt','pepper','garlic','ginger','oregano','paprika','cumin','thyme','chili']};
    Object.keys(map).forEach(name => {
      const item = {name, count:map[name]};
      if (keys.Seasonings.some(k => name.includes(k))) cats.Seasonings.push(item);
      else if (keys.Produce.some(k => name.includes(k))) cats.Produce.push(item);
      else if (keys.Proteins.some(k => name.includes(k))) cats.Proteins.push(item);
      else if (keys.Dairy.some(k => name.includes(k))) cats.Dairy.push(item);
      else if (keys.Pantry.some(k => name.includes(k))) cats.Pantry.push(item);
      else cats.Other.push(item);
    });
    return cats;
  };

  const allMyRecipes = guestMode ? [...sampleRecipes, ...userRecipes] : [...userRecipes];

  const FilterBar = ({ showTried=false, showAuthor=false }) => (
    <div style={{background:'#fefcf8',borderRadius:'8px',padding:'16px',marginBottom:'24px',border:'1px solid #e0d8cc'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',gap:'10px'}}>
        {[
          {label:'Cook Time',key:'cookTime',opts:[['all','All Times'],['quick','Quick < 20min'],['medium','20-40min'],['long','40+min']]},
          {label:'Meal Type',key:'mealType',opts:[['all','All Meals'],['breakfast','Breakfast'],['lunch','Lunch'],['dinner','Dinner']]},
          ...(showTried?[{label:'Status',key:'tried',opts:[['all','All'],['tried','Tried'],['untried','Not Tried']]}]:[]),
          ...(showAuthor?[{label:'Author',key:'author',opts:[['all','All Authors'],...[...new Set(followedRecipes.map(r=>r.author).filter(Boolean))].sort().map(a=>[a,a])]}]:[])
        ].map(({label,key,opts}) => (
          <div key={key}>
            <label style={{display:'block',marginBottom:'4px',fontSize:'11px',fontWeight:600,color:'#9a9080',textTransform:'uppercase'}}>{label}</label>
            <select value={recipeFilters[key]} onChange={e => setRecipeFilters(p=>({...p,[key]:e.target.value}))}
              style={{width:'100%',padding:'8px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'13px',background:'#f4f0ea',color:'#1c2820',cursor:'pointer'}}>
              {opts.map(([v,t]) => <option key={v} value={v}>{t}</option>)}
            </select>
          </div>
        ))}
        <div style={{display:'flex',alignItems:'flex-end'}}>
          <button onClick={() => setRecipeFilters({cookTime:'all',mealType:'all',tried:'all',author:'all'})}
            style={{width:'100%',padding:'8px',background:'#f0ece4',border:'none',borderRadius:'6px',fontSize:'13px',fontWeight:600,cursor:'pointer',color:'#1c2820'}}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );

  if (loadingSession) return (
    <div style={{minHeight:'100vh',background:'#f4f0ea',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:'#9a9080',fontSize:'18px'}}>Loading...</p>
    </div>
  );

  if (!session && !guestMode) return <AuthScreen onGuest={() => setGuestMode(true)} />;

  return (
    <div style={{minHeight:'100vh',background:'#f4f0ea',fontFamily:"'Jost',sans-serif",color:'#1c2820',overflowX:'hidden'}}>

      {/* Header */}
      {/* Guest mode banner */}
      {guestMode && (
        <div style={{background:'#1a1200',borderBottom:'1px solid #3d2e00',padding:'10px 20px',display:'flex',alignItems:'center',justifyContent:'center',gap:'12px',flexWrap:'wrap'}}>
          <span style={{color:'#fcc419',fontSize:'13px',fontWeight:600}}>👀 Viewing as guest &mdash; some features are disabled</span>
          <button onClick={() => setGuestMode(false)} style={{padding:'6px 16px',background:'#fcc419',color:'#1c2820',border:'none',borderRadius:'6px',fontSize:'12px',fontWeight:700,cursor:'pointer'}}>
            Sign In / Sign Up
          </button>
        </div>
      )}

      <div style={{background:'#1c2820',borderBottom:'1px solid #2c3c30',position:'sticky',top:0,zIndex:100}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',padding:isMobile?'8px 12px':'10px 24px'}}>
          {/* Top row: logo + profile */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:isMobile?'8px':0}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <img src="/logo.png" alt="Recipe Roulette Logo" style={{width:isMobile?'36px':'40px',height:isMobile?'36px':'40px',objectFit:'contain',flexShrink:0}} />
              <div>
                <h1 style={{margin:0,fontSize:isMobile?'18px':'22px',lineHeight:1.1,fontFamily:"'Libre Baskerville',serif"}}>
                  <span style={{fontWeight:700,color:'#f0ece4'}}>Recipe </span><span style={{fontWeight:400,fontStyle:'italic',color:'#c46a3a'}}>Roulette</span>
                </h1>
                <p style={{margin:0,fontSize:'10px',color:'#4a6a52',letterSpacing:'2px',fontFamily:"'Jost',sans-serif",textTransform:'uppercase'}}>Plan together, eat better</p>
              </div>
            </div>
            {/* Profile button - always top right */}
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              {saving && <span style={{fontSize:'11px',color:'#5a9a6a',fontWeight:600}}>Saving...</span>}
              <button onClick={() => setShowProfilePanel(true)}
                style={{display:'flex',alignItems:'center',gap:'8px',background:'rgba(255,255,255,0.08)',border:'1px solid #3a5040',borderRadius:'24px',padding:'5px 12px 5px 5px',cursor:'pointer',transition:'border-color 0.15s'}}>
                <div style={{width:'30px',height:'30px',borderRadius:'50%',overflow:'hidden',background:'#2c3c2c',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {profile.avatarUrl
                    ? <img src={profile.avatarUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    : <span style={{fontSize:'15px',fontWeight:600,color:'#f0ece4',fontFamily:"'Cormorant Garamond',serif"}}>{(profile.displayName || session?.user?.email || 'G')?.charAt(0).toUpperCase()}</span>
                  }
                </div>
                {!isMobile && (
                  <span style={{fontSize:'13px',fontWeight:500,color:'#c8d8c8',maxWidth:'110px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {profile.displayName || session?.user?.email?.split('@')[0]}
                  </span>
                )}
              </button>
            </div>
          </div>
          {/* Nav row — scrollable on mobile, inline on desktop */}
          <nav style={{display:'flex',gap:'6px',overflowX:'auto',WebkitOverflowScrolling:'touch',paddingBottom:isMobile?'2px':0,paddingLeft:'2px',scrollbarWidth:'none',msOverflowStyle:'none'}}>
            {[{id:'calendar',label:'My Meals'},{id:'recipes',label:'Recipe Book'},{id:'community',label:'Community'},{id:'settings',label:'Settings'}].map(item => (
              <button key={item.id} onClick={() => setCurrentView(item.id)}
                style={{padding:isMobile?'8px 14px':'9px 16px',background:'transparent',color:currentView===item.id?'#5a9a6a':'#4a6a52',borderBottom:currentView===item.id?'2px solid #5a9a6a':'2px solid transparent',border:'none',borderRadius:0,cursor:'pointer',fontWeight:currentView===item.id?600:400,fontSize:isMobile?'12px':'13px',whiteSpace:'nowrap',flexShrink:0,letterSpacing:'0.5px',fontFamily:"'Jost',sans-serif"}}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:isMobile?'16px 12px':'28px 24px'}}>


        {/* HOME FEED */}
        {/* COMMUNITY */}
        {currentView === 'community' && (
          <div>
            {/* ── COMMUNITY TOGGLE ── */}
            <div style={{display:'flex',background:'#f0ece4',borderRadius:'12px',padding:'4px',marginBottom:'28px',gap:'2px'}}>
              <button
                onClick={() => setCommunitySubView('feed')}
                style={{flex:1,padding:'10px 0',borderRadius:'9px',border:'none',cursor:'pointer',fontWeight:600,fontSize:'14px',fontFamily:"'Jost',sans-serif",transition:'all 0.2s',
                  background: communitySubView === 'feed' ? '#fefcf8' : 'transparent',
                  color: communitySubView === 'feed' ? '#1c2820' : '#8a7a6a',
                  boxShadow: communitySubView === 'feed' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none'
                }}>
                My Feed
              </button>
              <button
                onClick={() => setCommunitySubView('recipes')}
                style={{flex:1,padding:'10px 0',borderRadius:'9px',border:'none',cursor:'pointer',fontWeight:600,fontSize:'14px',fontFamily:"'Jost',sans-serif",transition:'all 0.2s',
                  background: communitySubView === 'recipes' ? '#fefcf8' : 'transparent',
                  color: communitySubView === 'recipes' ? '#1c2820' : '#8a7a6a',
                  boxShadow: communitySubView === 'recipes' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none'
                }}>
                Community Recipes
              </button>
            </div>

            {/* ── MY FEED ── */}
            {communitySubView === 'feed' && (
              <div style={{maxWidth:isMobile?'100%':'680px',margin:'0 auto'}}>
            {/* Greeting */}
            <div style={{marginBottom:'28px'}}>
              <h2 style={{fontSize:isMobile?'26px':'32px',fontWeight:600,color:'#1c2820',margin:'0 0 4px 0',fontFamily:"'Cormorant Garamond',serif"}}>
                {(() => { const h = new Date().getHours(); const name = loadingProfile ? '' : (profile.displayName || session?.user?.email?.split('@')[0]); return `Good ${h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'}${name ? `, ${name}` : ''} 👋`; })()}
              </h2>
              <p style={{color:'#6a6050',margin:0,fontSize:'14px'}}>
                {(() => { const d = new Date(); const opts = {month:'long', day:'numeric'}; const start = new Date(d); start.setDate(d.getDate() - d.getDay()); const end = new Date(start); end.setDate(start.getDate() + 6); return `Week of ${start.toLocaleDateString('en-US', opts)} — ${end.toLocaleDateString('en-US', opts)}`; })()}
              </p>
            </div>

            {/* ── TRENDING THIS WEEK ─────────────────────────────── */}
            <div style={{marginBottom:'28px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
                <h2 style={{margin:0,fontSize:'17px',fontWeight:700,color:'#1c2820',fontFamily:"'Jost',sans-serif"}}>🔥 Trending This Week</h2>
                <span style={{fontSize:'12px',color:'#9a9080'}}>Updated every Monday</span>
              </div>
              <div style={{display:'flex',gap:'12px',overflowX:'auto',paddingBottom:'8px',scrollbarWidth:'none',msOverflowStyle:'none',WebkitOverflowScrolling:'touch'}}>
                {trendingRecipes.map((recipe, idx) => {
                  const fullRecipe = recipe; // full data is embedded in trendingRecipes
                  const alreadyAdded = [...userRecipes, ...(guestMode ? sampleRecipes : [])].some(r => r.name === recipe.name);
                  return (
                    <div key={recipe.id}
                      style={{minWidth:'160px',maxWidth:'160px',background:'#fefcf8',borderRadius:'12px',overflow:'hidden',border:'1px solid #e0d8cc',flexShrink:0,display:'flex',flexDirection:'column'}}
                    >
                      <div
                        style={{position:'relative',height:'100px',backgroundImage:`url(${recipe.image})`,backgroundSize:'cover',backgroundPosition:'center',cursor:'pointer'}}
                        onClick={() => { if (fullRecipe) setSelectedRecipe(fullRecipe); }}
                      >
                        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)'}} />
                        <div style={{position:'absolute',top:'7px',left:'7px',background:'rgba(0,0,0,0.6)',backdropFilter:'blur(6px)',padding:'3px 8px',borderRadius:'10px',fontSize:'10px',fontWeight:700,color:'#fff'}}>
                          #{idx+1}
                        </div>
                      </div>
                      <div style={{padding:'10px',flex:1,display:'flex',flexDirection:'column',gap:'6px'}}>
                        <div>
                          <p style={{margin:'0 0 2px 0',fontSize:'12px',fontWeight:700,color:'#1c2820',lineHeight:1.3,cursor:'pointer'}} onClick={() => { if (fullRecipe) setSelectedRecipe(fullRecipe); }}>{recipe.name}</p>
                          <p style={{margin:'0 0 4px 0',fontSize:'10px',color:'#9a9080'}}>{recipe.prepTime} • {recipe.servings} servings</p>
                          <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
                            <span style={{fontSize:'11px',color:'#c0392b',fontWeight:600}}>+{recipe.weeklyAdds}</span>
                            <span style={{fontSize:'10px',color:'#9a9080'}}>this week</span>
                          </div>
                        </div>
                        {(
                          <button
                            disabled={alreadyAdded}
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (alreadyAdded) return;
                              const newR = {...fullRecipe, id: Date.now(), source:'discover'};
                              if (guestMode) {
                                setSampleRecipes(p => [...p, newR]);
                              } else {
                                setUserRecipes(p => [...p, newR]);
                                await supabase.from('user_recipes').insert({user_id: session.user.id, recipe: newR});
                              }
                            }}
                            style={{width:'100%',padding:'5px 0',background:alreadyAdded?'#f0ece4':'#2d5a3d',color:alreadyAdded?'#9a9080':'#fff',border:'none',borderRadius:'7px',fontSize:'10px',fontWeight:600,cursor:alreadyAdded?'default':'pointer'}}>
                            {alreadyAdded ? '✓ In My Book' : '+ Add to Book'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── WEEKLY FEED ─────────────────────────────────────────── */}

            {/* Category filter pills */}
            {(() => {
              const filters = [
                {id:'all', label:'All'},
                {id:'seasonal', label:'🌸 Seasonal'},
                {id:'quick', label:'⚡ Quick Meals'},
                {id:'tip', label:'💡 Tips'},
                {id:'nutrition', label:'🥗 Nutrition'},
                {id:'community', label:'⭐ Community'},
                {id:'video', label:'🎬 Tips & Tricks'},
              ];
              const filtered = activeFilter === 'all' ? feedPosts : feedPosts.filter(p => p.category === activeFilter);

              return (
                <div>
                  <div style={{display:'flex',gap:'8px',marginBottom:'24px',overflowX:'auto',paddingBottom:'8px',scrollbarWidth:'none',msOverflowStyle:'none',WebkitOverflowScrolling:'touch'}}>
                    {filters.map(f => (
                      <button key={f.id} onClick={() => setActiveFilter(f.id)}
                        style={{padding:'7px 16px',background:activeFilter===f.id?'#1c2820':'#fefcf8',color:activeFilter===f.id?'#f0ece4':'#6a6050',border:activeFilter===f.id?'1px solid #1c2820':'1px solid #ddd8d0',borderRadius:'20px',cursor:'pointer',fontWeight:activeFilter===f.id?600:400,fontSize:'12px',whiteSpace:'nowrap',transition:'all 0.15s',fontFamily:"'Jost',sans-serif"}}>
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Feed cards */}
                  <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    {filtered.map((post, idx) => {
                      const isSaved = savedPosts.has(post.id);
                      const isHero = post.type === 'hero';
                      const isTip = post.type === 'tip';
                      const isVideo = post.type === 'video';

                      return (
                        <div key={post.id} style={{background:'#fefcf8',borderRadius:'16px',overflow:'hidden',border:'1px solid #e0d8cc',transition:'transform 0.15s'}}>

                          {/* Video card */}
                          {isVideo && (
                            <div style={{position:'relative',height:'200px',overflow:'hidden',background:'#111'}}>
                              <div onClick={() => window.open(`https://www.youtube.com/watch?v=${post.youtubeId}`, '_blank', 'noopener,noreferrer')} style={{position:'relative',height:'100%',cursor:'pointer'}}>
                                  <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.82}}
                                  />
                                  <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.72) 100%)'}} />
                                  <div style={{position:'absolute',top:'14px',left:'14px',background:'rgba(0,0,0,0.55)',backdropFilter:'blur(8px)',padding:'5px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:600,color:'#ffffff',border:'1px solid rgba(255,255,255,0.25)'}}>
                                    {post.tag}
                                  </div>
                                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <div style={{width:'52px',height:'52px',background:'rgba(255,0,0,0.9)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 16px rgba(0,0,0,0.5)',transition:'transform 0.15s'}}
                                      onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
                                      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                                    >
                                      <span style={{fontSize:'20px',marginLeft:'4px',color:'#fff'}}>▶</span>
                                    </div>
                                  </div>
                                  <div style={{position:'absolute',bottom:'7px',right:'12px',background:'rgba(0,0,0,0.72)',padding:'3px 8px',borderRadius:'6px',fontSize:'11px',fontWeight:600,color:'#fff'}}>{post.duration}</div>
                                </div>
                            </div>
                          )}

                          {/* Image — full width for hero, shorter for others */}
                          {!isVideo && (isHero || !isTip) && (
                            <div style={{position:'relative',height:isHero?'320px':'200px',backgroundImage:`url(${post.image})`,backgroundSize:'cover',backgroundPosition:'center'}}>
                              <div style={{position:'absolute',inset:0,background:isHero?'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)':'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)'}}>
                              </div>
                              {/* Tag badge */}
                              <div style={{position:'absolute',top:'14px',left:'14px',background:'rgba(0,0,0,0.55)',backdropFilter:'blur(8px)',padding:'5px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:600,color:'#ffffff',border:'1px solid rgba(255,255,255,0.25)'}}>
                                {post.tag}
                              </div>
                              {/* Title on image for hero */}
                              {isHero && (
                                <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'20px'}}>
                                  <h3 style={{margin:0,fontSize:'22px',fontWeight:700,color:'#ffffff',lineHeight:1.3,textShadow:'0 1px 4px rgba(0,0,0,0.5)'}}>{post.title}</h3>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Card body */}
                          <div style={{padding:'18px'}}>
                            {/* Tag for tip cards (no image header) */}
                            {isTip && (
                              <div style={{display:'inline-block',background:'#f0ece4',padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:600,color:'#9a9080',marginBottom:'10px',border:'1px solid #d8d0c4'}}>
                                {post.tag}
                              </div>
                            )}

                            {/* Title for non-hero */}
                            {!isHero && !isVideo && (
                              <h3 style={{margin:'0 0 8px 0',fontSize:'20px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",lineHeight:1.3}}>{post.title}</h3>
                            )}

                            {isVideo && (
                              <div style={{marginBottom:'4px'}}>
                                <p style={{margin:'0 0 4px 0',fontSize:'16px',fontWeight:600,color:'#1c2820',lineHeight:1.35,fontFamily:"'Cormorant Garamond',serif"}}>{post.title}</p>
                                <p style={{margin:'0 0 10px 0',fontSize:'12px',color:'#9a9080'}}>{post.channel} · {post.duration}</p>
                              </div>
                            )}
                            <p style={{margin:'0 0 16px 0',fontSize:'14px',color:'#9a9080',lineHeight:1.7}}>{post.body}</p>

                            {/* Recipe card inside post */}
                            {post.recipe && (
                              <div onClick={() => setSelectedRecipe(post.recipe)}
                                style={{background:'#f0ece4',borderRadius:'10px',overflow:'hidden',cursor:'pointer',border:'1px solid #d8d0c4',display:'flex',gap:'0',marginBottom:'14px',transition:'border-color 0.15s'}}>
                                <div style={{width:'90px',minWidth:'90px',backgroundImage:`url(${post.recipe.image})`,backgroundSize:'cover',backgroundPosition:'center'}} />
                                <div style={{padding:'12px',flex:1}}>
                                  <p style={{margin:'0 0 3px 0',fontSize:'13px',fontWeight:700,color:'#1c2820'}}>{post.recipe.name}</p>
                                  <p style={{margin:'0 0 6px 0',fontSize:'11px',color:'#6a6050'}}>{post.recipe.prepTime} • {post.recipe.servings} servings</p>
                                  <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                                    {post.recipe.tags?.slice(0,3).map(tag => (
                                      <span key={tag} style={{background:'#fefcf8',border:'1px solid #d8d0c4',padding:'2px 8px',borderRadius:'10px',fontSize:'10px',color:'#9a9080'}}>{tag}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action row */}
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <span style={{fontSize:'12px',color:'#7a7060'}}>{isVideo ? post.channel : 'Recipe Roulette'}</span>
                              {isVideo && (
                                <a
                                  href={`https://www.youtube.com/watch?v=${post.youtubeId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{padding:'7px 14px',background:'#ff0000',color:'#fff',border:'none',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',textDecoration:'none'}}>
                                  ▶ Watch on YouTube
                                </a>
                              )}
                              {post.recipe && (
                                <div style={{display:'flex',gap:'8px'}}>
                                  <button
                                    onClick={() => {
                                      if (!isSaved) {
                                        setSavedPosts(prev => new Set([...prev, post.id]));
                                        if (post.recipe && !userRecipes.find(r => r.id === post.recipe.id)) {
                                          const nr = {...post.recipe, timesMade:0};
                                          setUserRecipes(prev => [...prev, nr]);
                                          supabase.from('user_recipes').insert({user_id:session.user.id, recipe:nr});
                                        }
                                      }
                                    }}
                                    style={{padding:'7px 14px',background:isSaved?'#262626':'#ffffff',color:isSaved?'#666':'#000',border:'none',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:isSaved?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:'5px',transition:'all 0.15s'}}>
                                    {isSaved ? '✓ Saved' : '+ Save Recipe'}
                                  </button>
                                  <button onClick={() => setShowAddToCalendar(post.recipe)}
                                    style={{padding:'7px 14px',background:'#fefcf8',color:'#1c2820',border:'1px solid #d8d0c4',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer',transition:'all 0.15s'}}>
                                    Add to Calendar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
              </div>
            )}

            {/* ── COMMUNITY RECIPES ── */}
            {communitySubView === 'recipes' && (
              <div>
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
                  <div style={{flex:1,height:'1px',background:'#e8e0d4'}} />
                  <h2 style={{fontSize:isMobile?'22px':'26px',fontWeight:600,color:'#1c2820',margin:0,fontFamily:"'Cormorant Garamond',serif",whiteSpace:'nowrap'}}>Community Recipes</h2>
                  <div style={{flex:1,height:'1px',background:'#e8e0d4'}} />
                </div>
              <div style={{marginBottom:'20px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px',marginBottom:'8px'}}>
                <button onClick={() => setShowFindPeople(true)} style={{padding:'9px 16px',background:'#fefcf8',border:'1px solid #d8d0c4',borderRadius:'8px',fontWeight:600,fontSize:'13px',cursor:'pointer',color:'#5a9a6a',whiteSpace:'nowrap'}}>
                  👥 Find People
                </button>
              </div>
              <div style={{display:'flex',justifyContent:'center',gap:'32px',marginBottom:'12px'}}>
                  <button onClick={() => setShowFollowModal('following')} style={{background:'none',border:'none',cursor:'pointer',textAlign:'center',padding:0}}>
                    <span style={{fontWeight:700,color:'#1c2820',fontSize:'14px'}}>{follows.size}</span>
                    <span style={{color:'#9a9080',fontSize:'13px',marginLeft:'4px'}}>Following</span>
                  </button>
                  <button onClick={() => setShowFollowModal('followers')} style={{background:'none',border:'none',cursor:'pointer',textAlign:'center',padding:0}}>
                    <span style={{fontWeight:700,color:'#1c2820',fontSize:'14px'}}>{followers.length}</span>
                    <span style={{color:'#9a9080',fontSize:'13px',marginLeft:'4px'}}>Followers</span>
                  </button>
              </div>
              <p style={{color:'#6a6050',margin:0}}>{filterRecipes(followedRecipes).length} recipes</p>
            </div>
            {/* Community search bar */}
            <div style={{position:'relative',marginBottom:'16px'}}>
              <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'#7a7060',pointerEvents:'none',fontSize:'16px'}}>🔍</span>
              <input
                type="text"
                placeholder="Search community recipes..."
                value={communitySearch}
                onChange={e => setCommunitySearch(e.target.value)}
                style={{width:'100%',padding:'11px 14px 11px 42px',background:'#fefcf8',border:'1px solid #e0d8cc',borderRadius:'10px',fontSize:'14px',color:'#1c2820',outline:'none',boxSizing:'border-box'}}
              />
              {communitySearch && (
                <button onClick={() => setCommunitySearch('')} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#7a7060',fontSize:'18px',lineHeight:1}}>×</button>
              )}
            </div>
            <FilterBar showAuthor />
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fill, minmax(260px, 1fr))',gap:'18px'}}>
              {((() => {
                let list = filterRecipes(followedRecipes);
                if (communitySearch.trim()) list = list.filter(r => r.name.toLowerCase().includes(communitySearch.toLowerCase()) || (r.tags||[]).some(t => t.toLowerCase().includes(communitySearch.toLowerCase())) || (r.author||'').toLowerCase().includes(communitySearch.toLowerCase()));
                return list;
              })()).length === 0 ? (
                <div style={{gridColumn:'1/-1',textAlign:'center',padding:'60px',background:'#fefcf8',borderRadius:'12px',border:'1px solid #e0d8cc'}}>
                  <p style={{fontSize:'32px',margin:'0 0 10px 0'}}>{communitySearch ? '🔍' : '🍽'}</p>
                  <p style={{color:'#9a9080'}}>{communitySearch ? `No recipes match "${communitySearch}"` : follows.size === 0 ? 'Find and follow friends to see their recipes here.' : 'No recipes from people you follow yet'}</p>
                </div>
              ) : ((() => {
                let list = filterRecipes(followedRecipes);
                if (communitySearch.trim()) list = list.filter(r => r.name.toLowerCase().includes(communitySearch.toLowerCase()) || (r.tags||[]).some(t => t.toLowerCase().includes(communitySearch.toLowerCase())) || (r.author||'').toLowerCase().includes(communitySearch.toLowerCase()));
                return list;
              })()).map(recipe => (
                <div key={recipe.id} style={{background:'#fefcf8',borderRadius:'12px',overflow:'hidden',border:'1px solid #e0d8cc'}}>
                  <div onClick={() => setSelectedRecipe(recipe)} style={{cursor:'pointer'}}>
                    <div style={{height:'170px',position:'relative'}}>
                      {recipe.image
                        ? <div style={{height:'170px',backgroundImage:`url(${recipe.image})`,backgroundSize:'cover',backgroundPosition:'center'}} />
                        : <div style={{height:'170px',background:'#f0ece4',display:'flex',alignItems:'center',justifyContent:'center',padding:'12px'}}><p style={{margin:0,fontSize:'16px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',textAlign:'center',lineHeight:1.3}}>{recipe.name}</p></div>
                      }
                      {recipe.cookTime < 20 && <div style={{position:'absolute',top:'10px',left:'10px',background:'#5a9a6a',color:'#fff',padding:'3px 8px',borderRadius:'6px',fontSize:'11px',fontWeight:600,display:'flex',alignItems:'center',gap:'3px'}}><Clock size={11} /> Quick</div>}
                    </div>
                    <div style={{padding:'14px 14px 8px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                        <div onClick={async e => { e.stopPropagation(); const p = followingList.find(p => p.user_id === recipe._followedUserId); if (p) setViewingProfile(p); }}
                          style={{display:'flex',alignItems:'center',gap:'7px',cursor:'pointer',flex:1,minWidth:0}}>
                          <div style={{width:'26px',height:'26px',borderRadius:'50%',background:'#e0d8cc',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',flexShrink:0,overflow:'hidden'}}>
                            {(() => { const p = followingList.find(p => p.user_id === recipe._followedUserId); return p?.avatar_url ? <img src={p.avatar_url} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : '👤'; })()}
                          </div>
                          <span style={{fontSize:'12px',color:'#5a9a6a',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                            {followingList.find(p => p.user_id === recipe._followedUserId)?.username || recipe.author || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <h3 style={{margin:'0 0 6px 0',fontSize:'15px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>{recipe.name}</h3>
                      <p style={{margin:0,fontSize:'12px',color:'#9a9080'}}>{[recipe.prepTime, recipe.cookTime ? `${recipe.cookTime} min cook` : null].filter(Boolean).join(' · ') || ' '}</p>
                    </div>
                  </div>
                  <div style={{padding:'8px 14px 14px',display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    <button onClick={e => { e.stopPropagation(); setShowRatingModal(recipe); }} style={{flex:'1 1 45%',padding:'7px',background:userRatings[recipe.id]?'#1a1a1a':'#262626',color:userRatings[recipe.id]?'#fbbf24':'#999',border:'1px solid #d8d0c4',borderRadius:'6px',fontSize:'11px',fontWeight:600,cursor:'pointer'}}>
                      {userRatings[recipe.id] ? `★ ${userRatings[recipe.id].rating}` : '☆ Rate'}
                    </button>
                    <button onClick={e => { e.stopPropagation(); saveCommunityRecipe(recipe); }} disabled={savedRecipes.has(recipe.id)}
                      style={{flex:'1 1 45%',padding:'7px',background:savedRecipes.has(recipe.id)?'#f0ece4':'#1c2820',color:savedRecipes.has(recipe.id)?'#9a9080':'#f0ece4',border:'1px solid #d8d0c4',borderRadius:'6px',fontSize:'11px',fontWeight:600,cursor:savedRecipes.has(recipe.id)?'not-allowed':'pointer'}}>
                      {savedRecipes.has(recipe.id) ? '✓ Book' : '+ Book'}
                    </button>
                    <button onClick={e => { e.stopPropagation(); setShowSaveToFolderModal(recipe); }}
                      style={{flex:'1 1 30%',padding:'7px',background:'#fefcf8',color:'#1c2820',border:'1px solid #d8d0c4',borderRadius:'6px',fontSize:'11px',fontWeight:600,cursor:'pointer'}}>
                      🗂
                    </button>
                    <button onClick={e => { e.stopPropagation(); setShowAddToCalendar(recipe); }}
                      style={{flex:'1 1 30%',padding:'7px',background:'#1c2820',color:'#f0ece4',border:'none',borderRadius:'6px',fontSize:'11px',fontWeight:600,cursor:'pointer'}}>
                      📅
                    </button>
                  </div>
                </div>
              ))}
            </div>
              </div>
            )}
          </div>
        )}
        {/* MY MEALS */}
        {currentView === 'calendar' && (
          <div>
            <div style={{marginBottom:'24px'}}>
              <h2 style={{fontSize:isMobile?'24px':'30px',fontWeight:600,color:'#1c2820',margin:'0 0 2px 0',fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic'}}>Weekly Meal Plan</h2>
              <p style={{color:'#6a6050',margin:'0 0 10px 0',fontSize:'13px'}}>Drag meals to rearrange • Click to view details</p>
              {autoFillWarning === 'duplicate' && (
                <div style={{background:'#fff8e6',border:'1px solid #f0c040',borderRadius:'8px',padding:'10px 14px',marginBottom:'14px',display:'flex',alignItems:'flex-start',gap:'10px'}}>
                  <span style={{fontSize:'16px',flexShrink:0}}>⚠️</span>
                  <div>
                    <p style={{margin:'0 0 2px 0',fontSize:'12px',fontWeight:700,color:'#7a5c00'}}>Not enough recipes to avoid repeats</p>
                    <p style={{margin:0,fontSize:'12px',color:'#7a5c00',lineHeight:1.5}}>Your Recipe Book didn't have enough variety to fill your full week without duplicates. Try adding more recipes from the Discover tab, or increase the Community Meals slider in Auto-Fill settings.</p>
                  </div>
                  <button onClick={() => setAutoFillWarning('')} style={{background:'none',border:'none',cursor:'pointer',color:'#7a5c00',fontSize:'16px',flexShrink:0,padding:0,marginLeft:'auto'}}>×</button>
                </div>
              )}
              {showMealsTip && (
                <div style={{background:'#f4f0ea',borderRadius:'8px',padding:'10px 14px',marginBottom:'14px',border:'1px solid #e8e0d4',position:'relative'}}>
                  <button onClick={() => { setShowMealsTip(false); localStorage.setItem('mealsTipDismissed', 'true'); }}
                    style={{position:'absolute',top:'8px',right:'10px',background:'none',border:'none',cursor:'pointer',color:'#9a9080',fontSize:'16px',lineHeight:1,padding:0}}>×</button>
                  <p style={{margin:'0 0 8px 0',fontSize:'12px',fontWeight:700,color:'#1c2820',fontFamily:"'Jost',sans-serif",letterSpacing:'0.3px'}}>💡 How to plan your week</p>
                  <div style={{display:'flex',flexDirection:'column',gap:'6px',paddingRight:'16px'}}>
                    <p style={{margin:0,fontSize:'12px',color:'#6a6050',lineHeight:1.5}}><strong style={{color:'#1c2820'}}>Step 1 —</strong> Go to <button onClick={() => setCurrentView('settings')} style={{background:'none',border:'none',padding:0,color:'#2d5a3d',fontWeight:600,fontSize:'12px',cursor:'pointer',textDecoration:'underline',fontFamily:"'Jost',sans-serif"}}>Settings</button> to choose which meals and days you want to plan for. Remove any day you don’t need this week (eating out, leftovers, fasting, etc.).</p>
                    <p style={{margin:0,fontSize:'12px',color:'#6a6050',lineHeight:1.5}}><strong style={{color:'#1c2820'}}>Step 2 —</strong> Tap the <strong>+</strong> in any slot to manually add recipes from your existing Recipe Book that you know you want to cook this week.</p>
                    <p style={{margin:0,fontSize:'12px',color:'#6a6050',lineHeight:1.5}}><strong style={{color:'#1c2820'}}>Step 3 —</strong> Hit <strong>Auto-Fill</strong> to get suggestions for any remaining empty slots.</p>
                    <p style={{margin:'4px 0 0 0',fontSize:'12px',color:'#6a6050',lineHeight:1.5,borderTop:'1px solid #e8e0d4',paddingTop:'8px'}}><strong style={{color:'#1c2820'}}>📚 Tip:</strong> To build out your Recipe Book, import your favorites and browse the <strong>Discover</strong> section in the Recipe Book tab for featured creators, or check the <strong>Community</strong> tab to see what your friends have saved.</p>
                  </div>
                </div>
              )}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                <button onClick={() => setShowAutoFillModal(true)} style={{padding:'11px',background:'#fefcf8',border:'1px solid #1c2820',borderRadius:'4px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontWeight:500,fontSize:'13px',color:'#1c2820',fontFamily:"'Jost',sans-serif"}}>
                  <Wand2 size={15} /> Auto-Fill
                </button>
                <button onClick={() => setShowShoppingList(true)} style={{padding:'11px',background:'#fefcf8',border:'1px solid #1c2820',borderRadius:'4px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontWeight:500,fontSize:'13px',color:'#1c2820',fontFamily:"'Jost',sans-serif"}}>
                  <ShoppingCart size={15} /> Shopping List
                </button>
                <button onClick={() => setShowMealPlanShare(true)} style={{padding:'11px',background:'#fefcf8',border:'1px solid #d0c8bc',borderRadius:'4px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontWeight:500,fontSize:'13px',color:'#9a9080',fontFamily:"'Jost',sans-serif"}}>
                  📤 Share Week
                </button>
                <button onClick={clearAllMeals} style={{padding:'11px',background:'#fefcf8',border:'1px solid #c46a3a',borderRadius:'4px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontWeight:500,fontSize:'13px',color:'#c46a3a',fontFamily:"'Jost',sans-serif"}}>
                  <X size={15} /> Clear All
                </button>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {daysOfWeek.map((day, dayIndex) => (
                <div key={day} style={{background:'#fff',borderRadius:'6px',borderTop:`1px solid ${isToday(dayIndex)?'#c0dcc8':'#e8e0d4'}`,borderRight:`1px solid ${isToday(dayIndex)?'#c0dcc8':'#e8e0d4'}`,borderBottom:`1px solid ${isToday(dayIndex)?'#c0dcc8':'#e8e0d4'}`,borderLeft:isToday(dayIndex)?'3px solid #5a9a6a':'3px solid #d8d0c4',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                  {/* Day header */}
                  <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',borderBottom:'1px solid',borderBottomColor: isToday(dayIndex) ? '#e0f0e4' : '#f0ece4',background: isToday(dayIndex) ? '#f4fbf6' : '#faf8f4'}}>
                    <span style={{fontSize:'16px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>{day}</span>
                    <span style={{fontSize:'11px',color:'#9a9080',fontFamily:"'Jost',sans-serif"}}>{formatDayDate(dayIndex)}</span>
                    {isToday(dayIndex) && <span style={{marginLeft:'auto',fontSize:'9px',fontWeight:500,color:'#5a9a6a',border:'1px solid #5a9a6a',padding:'2px 8px',borderRadius:'2px',letterSpacing:'2px',textTransform:'uppercase',fontFamily:"'Jost',sans-serif"}}>Today</span>}
                  </div>
                  {/* Meal slots - 3 columns */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',padding:'12px 16px'}}>
                    {mealTypes.map(mealType => {
                      const disabled = isSlotDisabled(dayIndex, mealType);
                      const meal = mealPlan[dayIndex][mealType];
                      const mealColors = {breakfast:'#b06a10',lunch:'#3a6a40',dinner:'#2a3a7a'};
                      return (
                        <div key={mealType}
                          data-dropzone="true" data-day={dayIndex} data-meal={mealType}
                          onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, dayIndex, mealType)}
                          style={{borderRadius:'4px',padding:'8px',minHeight:'80px',border: disabled ? '1px dashed #d8d0c4' : draggedMeal && !(draggedMeal.d===dayIndex && draggedMeal.mt===mealType) ? '1px dashed #5a9a6a' : '1px solid #e8e4dc',position:'relative',opacity:disabled?0.4:1,transition:'border-color 0.15s',background: isToday(dayIndex) ? '#f6fbf8' : '#faf8f4'}}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}}>
                            <p style={{margin:0,fontSize:'9px',color:mealColors[mealType],textTransform:'uppercase',fontWeight:700,letterSpacing:'0.5px'}}>{mealType}</p>
                            {!meal && (
                              <button onClick={() => toggleSlotDisabled(dayIndex, mealType)}
                                style={{background:'none',border:'none',cursor:'pointer',padding:0,color:disabled?'#5a9a6a':'#9a9080',fontSize:'16px',lineHeight:1}}>
                                {disabled ? '+' : '×'}
                              </button>
                            )}
                          </div>
                          {disabled ? (
                            <p style={{margin:0,fontSize:'10px',color:'#4a4030',textAlign:'center',paddingTop:'4px'}}>Off</p>
                          ) : meal ? (
                            <div draggable={true}
                              onDragStart={(e) => handleDragStart(e, dayIndex, mealType, meal)}
                              onTouchStart={(e) => handleTouchStart(e, dayIndex, mealType, meal)}
                              onTouchMove={handleTouchMove}
                              onTouchEnd={handleTouchEnd}
                              onClick={() => setSelectedRecipe(meal)}
                              style={{cursor:'pointer',userSelect:'none',WebkitUserSelect:'none',touchAction:'none'}}>
                              {meal.image
                                ? <div style={{height:'48px',backgroundImage:`url(${meal.image})`,backgroundSize:'cover',backgroundPosition:'center',borderRadius:'5px',marginBottom:'5px'}} />
                                : null
                              }
                              <p style={{margin:0,fontSize:'10px',color:'#1c2820',fontWeight:600,lineHeight:1.3}}>{meal.name}</p>
                              <button onClick={e => { e.stopPropagation(); removeMealFromPlan(dayIndex, mealType); }}
                                style={{marginTop:'4px',background:'none',border:'none',cursor:'pointer',color:'#c0392b',fontSize:'10px',padding:0,fontWeight:600}}>Remove</button>
                            </div>
                          ) : (
                            <button onClick={() => setShowRecipeSelector({dayIndex, mealType})}
                              style={{background:'none',border:'none',cursor:'pointer',color:'#4a4030',fontSize:'22px',width:'100%',height:'44px',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECIPE BOOK */}
        {currentView === 'recipes' && (
          <div>
            {/* Sub-tabs */}
            <div style={{display:'flex',gap:'4px',marginBottom:'24px',background:'#f0ebe3',borderRadius:'12px',padding:'4px'}}>
              {[{id:'mybook',label:'📖 My Book'},{id:'discover',label:'✨ Discover'}].map(t => (
                <button key={t.id} onClick={() => { setRecipeBookTab(t.id); setDiscoverCollection(null); setDiscoverRecipe(null); }} style={{flex:1,padding:'10px 16px',borderRadius:'9px',border:'none',cursor:'pointer',fontWeight:600,fontSize:'14px',background:recipeBookTab===t.id?'#fefcf8':'transparent',color:recipeBookTab===t.id?'#1c2820':'#7a7060',boxShadow:recipeBookTab===t.id?'0 1px 3px rgba(0,0,0,0.1)':'none',transition:'all 0.15s'}}>{t.label}</button>
              ))}
            </div>
            {recipeBookTab === 'discover' && (() => {
              const discoverCollections = [
                {id:'budget-bytes',name:'Budget Bytes',emoji:'💵',tagline:'Delicious meals built around cost per serving',color:'#e8a838',website:'https://www.budgetbytes.com'},
                {id:'spend-with-pennies',name:'Spend With Pennies',emoji:'🪙',tagline:'Comfort food classics that stretch your grocery budget',color:'#c46a3a',website:'https://www.spendwithpennies.com'},

                {id:'fit-foodie-finds',name:'Fit Foodie Finds',emoji:'💪',tagline:"Balanced meals that don't feel like diet food",color:'#e85d4a',website:'https://fitfoodiefinds.com'},
                {id:'downshiftology',name:'Downshiftology',emoji:'🌿',tagline:'Whole foods, gluten-free friendly, beautifully simple',color:'#7aaa6a',website:'https://downshiftology.com'},
                {id:'skinnytaste',name:'Skinnytaste',emoji:'⚖️',tagline:'Lighter versions of the comfort food you love',color:'#e87ab0',website:'https://www.skinnytaste.com'},
                {id:'damn-delicious',name:'Damn Delicious',emoji:'⚡',tagline:'Fast, foolproof recipes for busy weeknights',color:'#e8a838',website:'https://damndelicious.net'},
                {id:'pinch-of-yum',name:'Pinch of Yum',emoji:'🌼',tagline:'Approachable, healthy, and genuinely craveable',color:'#f4a636',website:'https://pinchofyum.com'},
                {id:'half-baked-harvest',name:'Half Baked Harvest',emoji:'🍂',tagline:'Seasonal, indulgent, and deeply satisfying',color:'#c47a4a',website:'https://www.halfbakedharvest.com'},
                {id:'the-modern-proper',name:'The Modern Proper',emoji:'🕯️',tagline:'Elevated weeknight dinners worth coming home to',color:'#5a7a9a',website:'https://themodernproper.com'},
                {id:'meal-prep-on-fleek',name:'Meal Prep on Fleek',emoji:'🥗',tagline:'Macro-friendly batch cooking made easy',color:'#6aaa8a',website:'https://mealpreponfl.com'},
                {id:'workweek-lunch',name:'Workweek Lunch',emoji:'🧺',tagline:'Simple, satisfying lunches built for real schedules',color:'#e8785a',website:'https://workweeklunch.com'},
                {id:'sweet-peas-saffron',name:'Sweet Peas & Saffron',emoji:'❄️',tagline:'Freezer meals and make-ahead magic',color:'#8a7ac4',website:'https://sweetpeasandsaffron.com'},
                {id:'minimalist-baker',name:'Minimalist Baker',emoji:'🌱',tagline:'10 ingredients, 1 bowl, 30 minutes — vegan & GF',color:'#c4a43a',website:'https://minimalistbaker.com'},
                {id:'alec-treffs',name:'Alec Treffs',emoji:'💪',tagline:'High-protein, low-sugar recipes that actually taste indulgent',color:'#5a9a6a',website:'https://alectreffs.com'},
                {id:'ambitious-kitchen',name:'Ambitious Kitchen',emoji:'🏋️',tagline:'Healthyish recipes that bridge clean eating and comfort',color:'#e86a5a',website:'https://www.ambitiouskitchen.com'},
                {id:'brocc-your-body',name:'Brocc Your Body',emoji:'🥦',tagline:'Clean eating with a fitness-forward lens',color:'#4a8a5a',website:'https://broccyourbody.com'},
              ];
              const allDiscoverRecipes = [
                {id:2001,collection:'budget-bytes',name:'Chicken Noodle Soup',prepTime:'15 min',cookTime:90,servings:8,costPerServing:1.39,macros:{calories:280,protein:26,carbs:24,fat:8,fiber:2,sugar:3,sodium:680},tags:['Dinner','Soup','Easy'],image:'https://www.budgetbytes.com/wp-content/uploads/2017/02/Chicken-Noodle-Soup-Overhead-368x276.jpg',ingredients:['1 whole chicken or 2 lbs bone-in chicken pieces','3 medium carrots, sliced','3 stalks celery, sliced','1 medium onion, diced','4 cloves garlic, minced','8 oz egg noodles','8 cups chicken broth','1 tsp dried thyme','1 tsp dried parsley','Salt and pepper','2 tbsp olive oil'],instructions:['Heat oil in a large pot over medium heat. Add onion, carrots and celery, cook until softened, about 5 min.','Add garlic and cook 1 min more.','Add chicken and broth. Bring to a boil, reduce heat and simmer 1 hour until chicken is cooked through.','Remove chicken, shred the meat and discard bones and skin.','Add noodles to the pot and cook per package directions.','Return shredded chicken to the pot. Add thyme, parsley, salt and pepper.','Taste, adjust seasoning, and serve.'],timesMade:0,isEasy:true},
                {id:2002,collection:'budget-bytes',name:'Classic Meatloaf',prepTime:'15 min',cookTime:50,servings:7,costPerServing:1.32,macros:{calories:310,protein:24,carbs:14,fat:17,fiber:1,sugar:7,sodium:520},tags:['Dinner'],image:'https://www.budgetbytes.com/wp-content/uploads/2024/12/classic-meatloaf-slices-368x276.jpg',ingredients:['1.5 lbs ground beef (80/20)','1/2 cup breadcrumbs','1/3 cup milk','1 egg','1 small onion, finely diced','2 cloves garlic, minced','2 tbsp Worcestershire sauce','1 tsp Italian seasoning','1 tsp salt','1/2 tsp black pepper','1/2 cup ketchup','2 tbsp brown sugar','1 tbsp apple cider vinegar'],instructions:['Preheat oven to 350F.','In a large bowl, combine ground beef, breadcrumbs, milk, egg, onion, garlic, Worcestershire, Italian seasoning, salt and pepper. Mix until just combined — don\'t overwork it.','Shape into a loaf on a rimmed baking sheet or press into a 9x5 loaf pan.','Mix together ketchup, brown sugar and vinegar for the glaze. Spread half over the top of the loaf.','Bake 40 min, then spread remaining glaze over top.','Bake another 10 min until internal temp reaches 160F.','Rest 10 min before slicing.'],timesMade:0,isEasy:true},
                {id:2003,collection:'budget-bytes',name:'Homemade Mac and Cheese',prepTime:'5 min',cookTime:20,servings:4,costPerServing:0.88,macros:{calories:420,protein:18,carbs:48,fat:17,fiber:2,sugar:6,sodium:490},tags:['Dinner','Vegetarian','Easy'],image:'https://www.budgetbytes.com/wp-content/uploads/2024/12/Homemade-Mac-and-Cheese-Overhead-Macro-368x276.jpg',ingredients:['8 oz elbow macaroni','2 tbsp butter','2 tbsp all-purpose flour','1.5 cups whole milk','1/2 cup shredded sharp cheddar','1/2 cup shredded Gruyère or extra cheddar','1/2 tsp garlic powder','1/2 tsp smoked paprika','1/4 tsp mustard powder','Salt and pepper'],instructions:['Cook macaroni per package directions until al dente. Reserve 1/2 cup pasta water, then drain.','In the same pot, melt butter over medium heat. Whisk in flour and cook 1 min.','Slowly whisk in milk, a little at a time, until smooth. Cook, stirring constantly, until thickened, about 3-5 min.','Remove from heat. Stir in cheese until melted. Add garlic powder, paprika and mustard. Season with salt and pepper.','Add drained pasta and stir to coat. Thin with pasta water if needed.','Serve immediately.'],timesMade:0,isEasy:true},
                {id:2004,collection:'budget-bytes',name:'Baked Chicken Drumsticks',prepTime:'5 min',cookTime:40,servings:6,costPerServing:0.80,macros:{calories:220,protein:28,carbs:1,fat:12,fiber:0,sugar:0,sodium:360},tags:['Dinner','Easy','Gluten-Free'],image:'https://www.budgetbytes.com/wp-content/uploads/2021/08/Baked-Chicken-Drumsticks-Pan-368x276.jpg',ingredients:['6 chicken drumsticks','2 tbsp olive oil','1 tsp garlic powder','1 tsp smoked paprika','1/2 tsp onion powder','1/2 tsp dried oregano','1/2 tsp salt','1/4 tsp black pepper'],instructions:['Preheat oven to 400F. Line a baking sheet with foil and place a wire rack on top.','Pat drumsticks dry with paper towels.','Mix together all spices. Drizzle chicken with olive oil and rub spice mixture all over.','Arrange on the wire rack.','Bake 40 min, flipping halfway, until skin is golden and crispy and internal temp reaches 165F.'],timesMade:0,isEasy:true},
                {id:2005,collection:'budget-bytes',name:'One Pot Creamy Cajun Chicken Pasta',prepTime:'10 min',cookTime:20,servings:4,costPerServing:2.35,macros:{calories:510,protein:36,carbs:48,fat:18,fiber:3,sugar:5,sodium:780},tags:['Dinner','Easy'],image:'https://www.budgetbytes.com/wp-content/uploads/2018/10/One-Pot-Creamy-Cajun-Chicken-Pasta-pan-368x276.jpg',ingredients:['1 lb chicken breast, cut into bite-sized pieces','2 tsp Cajun seasoning','2 tbsp olive oil','3 cloves garlic, minced','1 can (14 oz) diced tomatoes','2.5 cups chicken broth','8 oz penne pasta','1/2 cup heavy cream','2 green onions, sliced','Salt and pepper'],instructions:['Toss chicken pieces with Cajun seasoning, salt and pepper.','Heat oil in a large deep skillet over medium-high. Add chicken and cook until browned, about 5 min. Remove and set aside.','In the same pan, sauté garlic 30 sec. Add diced tomatoes and broth. Bring to a boil.','Add pasta, stir well. Cover and cook over medium heat, stirring occasionally, until pasta is tender and most liquid is absorbed, about 12 min.','Stir in heavy cream and return chicken to the pan. Simmer 2-3 min.','Top with green onions and serve.'],timesMade:0,isEasy:true},
                {id:2006,collection:'budget-bytes',name:'Homemade Meatballs',prepTime:'25 min',cookTime:30,servings:8,costPerServing:1.96,macros:{calories:270,protein:22,carbs:8,fat:16,fiber:1,sugar:1,sodium:390},tags:['Dinner'],image:'https://www.budgetbytes.com/wp-content/uploads/2022/01/homemade-meatballs-spoon-368x276.jpg',ingredients:['1 lb ground beef','1/2 lb ground pork','1/2 cup breadcrumbs','1/4 cup milk','1 egg','3 cloves garlic, minced','1/4 cup fresh parsley, chopped','1/4 cup parmesan, grated','1 tsp salt','1/4 tsp black pepper','1/4 tsp red pepper flakes','2 tbsp olive oil'],instructions:['Combine breadcrumbs and milk in a large bowl, let soak 5 min.','Add ground beef, pork, egg, garlic, parsley, parmesan, salt, pepper and red pepper flakes. Mix gently until just combined.','Roll into 1.5-inch balls.','Heat oil in a large skillet over medium heat. Brown meatballs in batches, turning to brown all sides, about 5-6 min total.','Finish cooking in your sauce of choice, or bake at 400F for 10-12 more min until cooked through.'],timesMade:0,isEasy:false},
                {id:2007,collection:'budget-bytes',name:'Creamy Tomato Spinach Pasta',prepTime:'5 min',cookTime:20,servings:4,costPerServing:1.20,macros:{calories:380,protein:11,carbs:52,fat:14,fiber:4,sugar:7,sodium:410},tags:['Dinner','Vegetarian','Easy'],image:'https://www.budgetbytes.com/wp-content/uploads/2020/05/CreamyTomatoSpinachPasta_OverheadPlated-368x276.jpg',ingredients:['8 oz penne or rotini','2 tbsp olive oil','4 cloves garlic, minced','1 can (15 oz) diced tomatoes','1/2 tsp dried basil','1/2 tsp dried oregano','Pinch of red pepper flakes','1/4 cup heavy cream','2 cups fresh spinach','Salt and pepper','Parmesan to serve'],instructions:['Cook pasta per package directions. Reserve 1/2 cup pasta water, then drain.','Heat olive oil in a large skillet over medium heat. Add garlic and cook 1 min.','Add diced tomatoes (with juices), basil, oregano and red pepper flakes. Simmer 5 min.','Stir in heavy cream. Add spinach and stir until wilted.','Add drained pasta, toss to coat. Thin with pasta water as needed.','Season with salt and pepper. Serve topped with parmesan.'],timesMade:0,isEasy:true},
                {id:2008,collection:'budget-bytes',name:'Taco Soup',prepTime:'10 min',cookTime:30,servings:6,costPerServing:1.90,macros:{calories:340,protein:26,carbs:30,fat:12,fiber:8,sugar:6,sodium:820},tags:['Dinner','Soup','Easy'],image:'https://www.budgetbytes.com/wp-content/uploads/2023/03/Taco-Soup-Bowls-368x276.jpg',ingredients:['1 lb ground beef','1 onion, diced','3 cloves garlic, minced','1 packet taco seasoning','1 can (15 oz) black beans, drained','1 can (15 oz) kidney beans, drained','1 can (15 oz) corn, drained','1 can (10 oz) diced tomatoes with green chiles','1 can (15 oz) diced tomatoes','2 cups beef broth','Sour cream, shredded cheese, tortilla chips to serve'],instructions:['Brown ground beef in a large pot over medium-high heat. Drain excess fat.','Add onion and garlic, cook until softened, about 3 min.','Stir in taco seasoning.','Add all beans, corn, both cans of tomatoes and broth. Stir to combine.','Bring to a boil, reduce heat and simmer 20 min.','Serve topped with sour cream, cheese and crushed tortilla chips.'],timesMade:0,isEasy:true},
                {id:2009,collection:'budget-bytes',name:'Slow Cooker Beef Stew',prepTime:'15 min',cookTime:255,servings:8,costPerServing:1.41,macros:{calories:300,protein:28,carbs:22,fat:10,fiber:3,sugar:4,sodium:560},tags:['Dinner','Easy'],image:'https://www.budgetbytes.com/wp-content/uploads/2023/02/Slow-Cooker-Beef-Stew-bowlwithspoon-368x276.jpeg',ingredients:['2 lbs beef stew meat, cut into 1-inch cubes','3 medium carrots, sliced','3 stalks celery, sliced','1 lb baby potatoes, halved','1 onion, diced','4 cloves garlic, minced','2 cups beef broth','1 can (6 oz) tomato paste','2 tbsp Worcestershire sauce','1 tsp soy sauce','1 tsp rosemary','1 tsp thyme','2 tbsp cornstarch','Salt and pepper'],instructions:['Season beef cubes with salt and pepper.','Add beef, carrots, celery, potatoes, onion and garlic to the slow cooker.','Whisk together broth, tomato paste, Worcestershire, soy sauce, rosemary and thyme. Pour over everything.','Cook on high 4 hours or low 8 hours until beef is fork-tender.','In the last 30 min, whisk cornstarch with 2 tbsp cold water and stir into the stew to thicken.','Taste, season, and serve.'],timesMade:0,isEasy:true},
                {id:2010,collection:'budget-bytes',name:'Basic Chili',prepTime:'5 min',cookTime:45,servings:6,costPerServing:1.55,macros:{calories:350,protein:27,carbs:28,fat:14,fiber:9,sugar:6,sodium:640},tags:['Dinner','Easy'],image:'https://www.budgetbytes.com/wp-content/uploads/2018/09/Basic-Chili-in-Bowl-1200-368x276.jpg',ingredients:['1 lb ground beef','1 onion, diced','4 cloves garlic, minced','2 tbsp chili powder','1 tsp cumin','1 tsp smoked paprika','1/2 tsp oregano','1/4 tsp cayenne pepper','1 can (15 oz) kidney beans, drained','1 can (15 oz) diced tomatoes','1 can (6 oz) tomato paste','1 cup beef broth','Salt to taste','Sour cream, cheese, green onions to serve'],instructions:['Brown ground beef in a large pot over medium-high heat. Drain excess fat.','Add onion and garlic, cook until softened, about 3 min.','Add all spices and stir to coat the meat, cook 1 min.','Add beans, diced tomatoes, tomato paste and broth. Stir to combine.','Bring to a boil, reduce heat and simmer uncovered 30-35 min until thickened.','Season with salt. Serve with your favorite toppings.'],timesMade:0,isEasy:true},
                {id:2061,collection:'damn-delicious',name:'One Pot Garlic Butter Shrimp and Orzo',prepTime:'10 min',cookTime:20,servings:4,costPerServing:5.5,macros:{calories:430,protein:28,carbs:46,fat:14,fiber:2,sugar:3,sodium:720},tags:['Dinner','Easy'],image:'https://damndelicious.net/wp-content/uploads/2025/12/One-Pot-Garlic-Butter-Shrimp-and-Orzo_126-360x540.jpg',ingredients:['1 lb large shrimp, peeled and deveined','1.5 cups orzo','4 cloves garlic, minced','4 tbsp butter, divided','2 cups chicken broth','1 cup water','1/2 cup dry white wine','1/2 cup Parmesan, grated','2 tbsp fresh parsley, chopped','1 lemon, zested and juiced','1/4 tsp red pepper flakes','Salt and pepper'],instructions:['Melt 2 tbsp butter in a large skillet over medium-high heat. Add shrimp, season with salt and pepper, and cook 1–2 minutes per side until pink. Remove and set aside.','In the same skillet, melt remaining butter over medium heat. Add garlic and red pepper flakes, cook 1 minute.','Add white wine and let it bubble 1 minute.','Add orzo, broth and water. Bring to a boil, then reduce heat and simmer 10–12 minutes, stirring frequently, until orzo is cooked and liquid is mostly absorbed.','Stir in Parmesan, lemon zest and lemon juice.','Return shrimp to the skillet and toss to combine.','Garnish with parsley and serve immediately.'],timesMade:0,isEasy:true},
                {id:2062,collection:'damn-delicious',name:'Ravioli with Sun Dried Tomato Cream Sauce',prepTime:'5 min',cookTime:15,servings:4,costPerServing:4.0,macros:{calories:520,protein:18,carbs:54,fat:26,fiber:3,sugar:6,sodium:640},tags:['Dinner','Vegetarian','Easy'],image:'https://damndelicious.net/wp-content/uploads/2025/11/250409_DD_Ravioli-Sun-Dried-Tom-Cream-Sauce_670-360x540.jpg',ingredients:['20 oz refrigerated cheese ravioli','1 jar (8 oz) sun-dried tomatoes in oil, drained and chopped (reserve 2 tbsp oil)','4 cloves garlic, minced','1/2 cup heavy cream','1/2 cup chicken broth','1/2 cup Parmesan, grated','1 tsp Italian seasoning','1/4 tsp red pepper flakes','Fresh basil','Salt and pepper'],instructions:['Cook ravioli according to package directions. Reserve 1/2 cup pasta water, then drain.','Heat sun-dried tomato oil in a large skillet over medium heat. Add garlic, Italian seasoning and red pepper flakes, cook 1 minute.','Add sun-dried tomatoes, stir 1 minute.','Pour in broth and cream. Simmer 3–4 minutes until slightly thickened.','Add cooked ravioli and Parmesan, tossing gently. Add pasta water as needed.','Season with salt and pepper and serve topped with fresh basil.'],timesMade:0,isEasy:true},
                {id:2063,collection:'damn-delicious',name:'Quick Korean Bibimbap',prepTime:'20 min',cookTime:20,servings:4,costPerServing:4.5,macros:{calories:480,protein:24,carbs:56,fat:16,fiber:4,sugar:8,sodium:680},tags:['Dinner','Asian'],image:'https://damndelicious.net/wp-content/uploads/2025/09/250129_DD_Korean-Bibimbap_374-360x540.jpg',ingredients:['2 cups jasmine rice, cooked','1 lb ground beef','2 cups spinach','1 cup shredded carrots','1 cup bean sprouts','1 zucchini, julienned','4 eggs','3 tbsp soy sauce','1 tbsp sesame oil','1 tbsp gochujang (Korean chili paste)','1 tsp sugar','2 cloves garlic, minced','Sesame seeds and green onions to garnish'],instructions:['Season ground beef with 2 tbsp soy sauce, garlic and sugar. Cook in a skillet until browned. Set aside.','Blanch spinach in boiling water 30 seconds, drain and squeeze dry. Toss with sesame oil and remaining soy sauce.','Quickly sauté carrots, zucchini and bean sprouts separately in a little oil. Season each lightly.','Fry eggs sunny-side up in a separate pan.','Divide rice into 4 bowls. Arrange beef and vegetables in sections on top. Place a fried egg in the center.','Serve with gochujang for mixing in. Top with sesame seeds and green onions.'],timesMade:0,isEasy:false},
                {id:2064,collection:'damn-delicious',name:'Chicken Divan',prepTime:'15 min',cookTime:30,servings:6,costPerServing:4.2,macros:{calories:410,protein:38,carbs:16,fat:22,fiber:3,sugar:4,sodium:580},tags:['Dinner','Easy'],image:'https://damndelicious.net/wp-content/uploads/2025/08/250409_DD_Chicken-Divan_636-360x540.jpg',ingredients:['1.5 lb cooked chicken breast, shredded or diced','4 cups broccoli florets, blanched','1 can (10.5 oz) cream of chicken soup','1/2 cup mayonnaise','1/2 cup sour cream','1 tsp lemon juice','1 tsp curry powder','1 cup shredded cheddar, divided','1/2 cup Parmesan','1/2 cup breadcrumbs','Salt and pepper'],instructions:['Preheat oven to 350°F. Grease a 9x13 baking dish.','Arrange blanched broccoli in the baking dish. Top with chicken.','Whisk together cream of chicken soup, mayo, sour cream, lemon juice, curry powder, half the cheddar and salt and pepper.','Pour sauce evenly over the chicken and broccoli.','Top with remaining cheddar, Parmesan and breadcrumbs.','Bake 25–30 minutes until bubbly and golden on top. Rest 5 minutes before serving.'],timesMade:0,isEasy:true},
                {id:2065,collection:'damn-delicious',name:'Quick Pasta with Tomato Cream Sauce',prepTime:'5 min',cookTime:20,servings:4,costPerServing:2.8,macros:{calories:500,protein:14,carbs:62,fat:22,fiber:4,sugar:8,sodium:480},tags:['Dinner','Vegetarian','Easy'],image:'https://damndelicious.net/wp-content/uploads/2025/07/250129_DD_Pasta-Tomato-Cream-Sauce_508-360x540.jpg',ingredients:['12 oz penne or rigatoni','1 can (28 oz) crushed tomatoes','1/2 cup heavy cream','4 cloves garlic, minced','1 small onion, finely diced','3 tbsp olive oil','1 tsp Italian seasoning','1/4 tsp red pepper flakes','1/2 cup Parmesan, grated','Fresh basil','Salt and pepper'],instructions:['Cook pasta per package directions. Reserve 1/2 cup pasta water, drain.','Heat olive oil in a large skillet over medium heat. Cook onion 4–5 minutes until soft.','Add garlic, Italian seasoning and red pepper flakes, cook 1 minute.','Pour in crushed tomatoes. Simmer 10 minutes, stirring occasionally.','Stir in heavy cream and simmer 2 more minutes.','Add pasta and toss to coat, adding pasta water to loosen as needed.','Serve topped with Parmesan and fresh basil.'],timesMade:0,isEasy:true},
                {id:2066,collection:'damn-delicious',name:'Easy Chicken Quesadillas',prepTime:'10 min',cookTime:15,servings:4,costPerServing:3.2,macros:{calories:420,protein:34,carbs:30,fat:18,fiber:2,sugar:2,sodium:580},tags:['Dinner','Easy'],image:'https://damndelicious.net/wp-content/uploads/2025/05/241002_DD_Chicken-Quesadillas_361-360x540.jpg',ingredients:['2 cups cooked chicken, shredded','4 large flour tortillas','1.5 cups shredded Mexican blend cheese','1/2 cup black beans, drained','1/2 cup corn','1/4 cup diced jalapeños (optional)','2 tbsp butter or oil','Sour cream, salsa and guacamole to serve'],instructions:['Combine shredded chicken, beans, corn and jalapeños in a bowl.','Heat a large skillet or griddle over medium heat with a little butter.','Place one tortilla in the pan. Spread half the cheese on one half of the tortilla. Add half the chicken mixture on top of the cheese. Fold tortilla over.','Cook 2–3 minutes per side until golden and crispy and cheese is melted.','Repeat with remaining quesadillas.','Cut into wedges and serve with sour cream, salsa and guacamole.'],timesMade:0,isEasy:true},
                {id:2067,collection:'damn-delicious',name:'Peanut Chicken Kabobs',prepTime:'20 min',cookTime:15,servings:4,costPerServing:5.0,macros:{calories:380,protein:36,carbs:14,fat:20,fiber:2,sugar:8,sodium:640},tags:['Dinner','Asian','Gluten-Free'],image:'https://damndelicious.net/wp-content/uploads/2025/04/240619_DD_peanut-chicken-kabobs_216-360x540.jpg',ingredients:['1.5 lb chicken breast, cut into 1.5-inch cubes','Peanut sauce: 1/3 cup peanut butter, 3 tbsp soy sauce, 2 tbsp lime juice, 1 tbsp honey, 1 tbsp sesame oil, 2 tsp chili garlic sauce, 1 clove garlic minced, water to thin','Skewers (soaked in water if wooden)','Sesame seeds, green onions and cilantro to serve'],instructions:['Whisk together all peanut sauce ingredients, adding warm water 1 tbsp at a time until it reaches a pourable consistency.','Toss chicken cubes with half the peanut sauce. Let marinate 30 minutes, or up to overnight.','Thread chicken onto skewers.','Grill over medium-high heat, 5–6 minutes per side until cooked through with grill marks.','Serve drizzled with remaining peanut sauce and topped with sesame seeds, green onions and cilantro.'],timesMade:0,isEasy:true},
                {id:2068,collection:'damn-delicious',name:'One Pan Cilantro Lime Chicken and Rice',prepTime:'10 min',cookTime:30,servings:4,costPerServing:3.8,macros:{calories:450,protein:38,carbs:42,fat:12,fiber:2,sugar:3,sodium:520},tags:['Dinner','Gluten-Free','Easy'],image:'https://damndelicious.net/wp-content/uploads/2025/03/240619_DD_cilantro-lime-chk-rice_229-360x540.jpg',ingredients:['1.5 lb chicken thighs, boneless and skinless','1.5 cups long grain white rice','3 cups chicken broth','4 cloves garlic, minced','1 lime, zested and juiced','1/2 cup fresh cilantro, chopped, divided','1 tsp cumin','1 tsp chili powder','2 tbsp olive oil','Salt and pepper'],instructions:['Season chicken with cumin, chili powder, salt and pepper.','Heat olive oil in a large oven-safe skillet over medium-high heat. Sear chicken 4–5 minutes per side until golden. Remove and set aside.','In the same pan, sauté garlic 30 seconds. Add rice and stir to coat in the oil, 1 minute.','Pour in broth, lime juice and half the cilantro. Bring to a boil.','Nestle the chicken on top of the rice. Cover tightly and reduce heat to low.','Cook 20–22 minutes until rice is done and chicken is cooked through.','Serve topped with remaining cilantro and lime zest.'],timesMade:0,isEasy:true},
                {id:2069,collection:'damn-delicious',name:'Instant Pot White Chicken Chili',prepTime:'10 min',cookTime:30,servings:6,costPerServing:3.5,macros:{calories:360,protein:34,carbs:28,fat:12,fiber:7,sugar:4,sodium:620},tags:['Dinner','Soup','Gluten-Free','Easy'],image:'https://damndelicious.net/wp-content/uploads/2025/01/240412_DD_instant-pot-white-chicken-chili_483edit-360x540.jpg',ingredients:['1.5 lb chicken breast','2 cans (15 oz each) white beans, drained','1 can (4 oz) diced green chiles','1 onion, diced','4 cloves garlic, minced','2 cups chicken broth','1 cup frozen corn','1 tsp cumin','1 tsp chili powder','1/2 tsp oregano','1/4 tsp cayenne','Salt and pepper','Sour cream, shredded cheese, cilantro, lime and avocado to serve'],instructions:['Add chicken, beans, green chiles, onion, garlic, broth, corn and all spices to the Instant Pot.','Seal the lid and cook on High Pressure for 15 minutes.','Quick release the pressure.','Remove chicken and shred with two forks. Return to the pot.','Stir everything together and taste for seasoning.','Serve topped with sour cream, cheese, cilantro, avocado and a squeeze of lime.'],timesMade:0,isEasy:true},
                {id:2070,collection:'damn-delicious',name:'Guinness Beef Stew',prepTime:'20 min',cookTime:120,servings:6,costPerServing:6.0,macros:{calories:440,protein:36,carbs:26,fat:18,fiber:3,sugar:5,sodium:560},tags:['Dinner','Easy'],image:'https://damndelicious.net/wp-content/uploads/2025/01/241002_DD_Guinness-Beef-Stew_524-360x540.jpg',ingredients:['2.5 lb beef chuck, cut into 1.5-inch cubes','1 can (14.9 oz) Guinness stout','3 cups beef broth','1 lb baby potatoes, halved','3 carrots, sliced','1 onion, diced','4 cloves garlic, minced','2 tbsp tomato paste','1 tbsp Worcestershire sauce','2 tbsp flour','3 tbsp olive oil','Fresh thyme and rosemary','Salt and pepper','Fresh parsley to serve'],instructions:['Season beef with salt and pepper. Toss with flour to coat.','Heat olive oil in a large Dutch oven over high heat. Brown beef in batches, 2–3 minutes per side. Set aside.','Reduce heat to medium. Cook onion 4 minutes. Add garlic and tomato paste, cook 1 minute.','Pour in Guinness, scraping up the browned bits. Add broth and Worcestershire.','Return beef to the pot with thyme and rosemary. Bring to a boil.','Cover and simmer on low 1 hour. Add potatoes and carrots, simmer another 30–40 minutes until beef and vegetables are tender.','Season and serve topped with fresh parsley.'],timesMade:0,isEasy:false},
                {id:2071,collection:'pinch-of-yum',name:'Ricotta Meatballs with Crispy Topping',prepTime:'20 min',cookTime:40,servings:6,costPerServing:4.5,macros:{calories:420,protein:30,carbs:24,fat:22,fiber:3,sugar:6,sodium:580},tags:['Dinner'],image:'https://pinchofyum.com/tachyon/Ricotta-Meatballs-1.jpg',ingredients:['1.5 lb ground beef or a beef/pork mix','1/2 cup whole milk ricotta','1/3 cup breadcrumbs','1 egg','3 cloves garlic, minced','1/4 cup Parmesan, grated','1/4 cup fresh parsley','Salt and pepper','1 jar (24 oz) marinara sauce','Crispy topping: 1/2 cup panko, 2 tbsp olive oil, 2 tbsp Parmesan, pinch of red pepper flakes'],instructions:['Preheat oven to 425°F.','Combine ground meat, ricotta, breadcrumbs, egg, garlic, Parmesan, parsley, salt and pepper. Mix until just combined.','Roll into 1.5-inch meatballs and place on a rimmed baking sheet. Roast 15–18 minutes until browned.','Pour marinara into a large baking dish. Nestle the roasted meatballs in the sauce.','Mix panko with olive oil, Parmesan and red pepper flakes. Scatter over the meatballs.','Bake another 15–18 minutes until sauce is bubbling and topping is golden and crispy.','Serve over pasta or with crusty bread.'],timesMade:0,isEasy:false},
                {id:2072,collection:'pinch-of-yum',name:'Chicken Wontons in Spicy Chili Sauce',prepTime:'30 min',cookTime:10,servings:4,costPerServing:4.0,macros:{calories:380,protein:24,carbs:36,fat:14,fiber:2,sugar:6,sodium:760},tags:['Dinner','Asian'],image:'https://pinchofyum.com/tachyon/Chicken-Wontons-in-Spicy-Chili-Sauce-Square.png',ingredients:['1 lb ground chicken','1 tbsp fresh ginger, grated','2 cloves garlic, minced','2 tbsp soy sauce','1 tsp sesame oil','2 green onions, finely chopped','40 wonton wrappers','Spicy chili sauce: 3 tbsp chili crisp, 2 tbsp soy sauce, 1 tbsp rice vinegar, 1 tbsp sesame oil, 1 tsp sugar','Cucumber slices, sesame seeds and more green onions to serve'],instructions:['Mix ground chicken with ginger, garlic, soy sauce, sesame oil and green onions until combined.','Place 1 tsp filling in the center of a wonton wrapper. Wet the edges with water, fold in half and press to seal. Pinch the corners together.','Whisk together all spicy chili sauce ingredients.','Bring a large pot of water to a boil. Cook wontons in batches 3–4 minutes until they float and look translucent.','Drain and toss with the spicy chili sauce.','Serve topped with sesame seeds, green onions and cucumber.'],timesMade:0,isEasy:false},
                {id:2073,collection:'pinch-of-yum',name:'Sheet Pan Chicken Pitas with Tzatziki',prepTime:'15 min',cookTime:25,servings:4,costPerServing:4.8,macros:{calories:450,protein:38,carbs:38,fat:14,fiber:3,sugar:5,sodium:580},tags:['Dinner','Easy'],image:'https://pinchofyum.com/tachyon/Family-Style-Pitas-2.jpg',ingredients:['1.5 lb chicken thighs, boneless','3 tbsp olive oil','2 tsp garlic powder','2 tsp dried oregano','1 tsp smoked paprika','1 tsp cumin','Juice of 1 lemon','Salt and pepper','4 pita breads','Tzatziki, sliced cucumber, tomato, red onion and feta to serve'],instructions:['Preheat oven to 425°F. Line a baking sheet with parchment.','Toss chicken with olive oil, garlic powder, oregano, paprika, cumin, lemon juice, salt and pepper.','Spread on the baking sheet and roast 22–25 minutes until cooked through with crispy edges.','Rest 5 minutes, then slice or chop the chicken.','Warm pitas directly on the oven rack for 1–2 minutes.','Serve family-style: pile chicken on pitas with tzatziki, cucumber, tomato, red onion and feta.'],timesMade:0,isEasy:true},
                {id:2074,collection:'pinch-of-yum',name:'Saucy Gochujang Noodles with Chicken',prepTime:'10 min',cookTime:15,servings:4,costPerServing:3.8,macros:{calories:490,protein:30,carbs:58,fat:14,fiber:3,sugar:10,sodium:820},tags:['Dinner','Asian','Easy'],image:'https://pinchofyum.com/tachyon/Gochujang-Noodles-3.jpg',ingredients:['12 oz ramen or udon noodles','1 lb ground chicken','2 tbsp gochujang','3 tbsp soy sauce','2 tbsp sesame oil','1 tbsp honey','4 cloves garlic, minced','1 tsp fresh ginger, grated','2 green onions, sliced','Sesame seeds, cucumber and a fried egg to serve'],instructions:['Cook noodles per package directions. Drain and set aside.','Whisk together gochujang, soy sauce, sesame oil and honey.','Cook ground chicken in a large skillet over medium-high heat, breaking it apart, until cooked through.','Add garlic and ginger, cook 1 minute.','Add drained noodles and the sauce. Toss over medium heat until everything is coated and glossy.','Serve topped with green onions, sesame seeds, cucumber and a fried egg if desired.'],timesMade:0,isEasy:true},
                {id:2075,collection:'pinch-of-yum',name:'Ridiculously Good Air Fryer Salmon',prepTime:'5 min',cookTime:10,servings:4,costPerServing:8.0,macros:{calories:340,protein:38,carbs:4,fat:18,fiber:0,sugar:2,sodium:440},tags:['Dinner','Healthy','Gluten-Free','Easy'],image:'https://pinchofyum.com/tachyon/Air-Fryer-Salmon-3.jpg',ingredients:['4 salmon fillets (6 oz each)','2 tbsp soy sauce','1 tbsp honey','1 tbsp olive oil','2 cloves garlic, minced','1/2 tsp smoked paprika','Salt and pepper','Lemon wedges and fresh herbs to serve'],instructions:['Pat salmon dry. Mix soy sauce, honey, olive oil, garlic and paprika together.','Brush the glaze all over the salmon fillets. Let sit 5 minutes.','Preheat air fryer to 400°F. Place salmon skin-side down in the basket.','Air fry 8–10 minutes — it should be slightly darker on top and flake easily. Do not overcook.','Serve immediately with lemon wedges and fresh herbs.'],timesMade:0,isEasy:true},
                {id:2076,collection:'pinch-of-yum',name:'Ridiculously Good Chicken Tacos with Green Sauce',prepTime:'15 min',cookTime:25,servings:4,costPerServing:4.2,macros:{calories:390,protein:32,carbs:30,fat:16,fiber:4,sugar:4,sodium:540},tags:['Dinner','Gluten-Free','Easy'],image:'https://pinchofyum.com/tachyon/Favorite-Chicken-Tacos.jpg',ingredients:['1.5 lb chicken thighs, boneless','1 tbsp olive oil','1 tsp cumin','1 tsp chili powder','1 tsp garlic powder','Salt and pepper','Corn tortillas','Green sauce: 1 cup cilantro, 1 jalapeño, 2 cloves garlic, 1/2 cup sour cream or Greek yogurt, 1 lime juiced, salt','Toppings: slaw, avocado, cotija cheese'],instructions:['Season chicken with cumin, chili powder, garlic powder, salt and pepper.','Heat oil in a skillet over medium-high heat. Cook chicken 6–7 minutes per side until cooked through. Rest 5 minutes, then chop or shred.','Blend all green sauce ingredients until smooth. Taste and adjust seasoning.','Warm tortillas directly over a flame or in a dry skillet.','Build tacos: tortilla, chicken, slaw, avocado, cotija and a generous drizzle of green sauce.'],timesMade:0,isEasy:true},
                {id:2077,collection:'pinch-of-yum',name:'Instant Pot Red Curry Lentils',prepTime:'10 min',cookTime:25,servings:6,costPerServing:2.0,macros:{calories:320,protein:14,carbs:44,fat:10,fiber:12,sugar:5,sodium:480},tags:['Dinner','Vegetarian','Vegan','Gluten-Free','Easy'],image:'https://pinchofyum.com/tachyon/Instant-Pot-Red-Curry-Lentils.jpg',ingredients:['2 cups red lentils, rinsed','1 can (14 oz) coconut milk','2 cups vegetable broth','1 can (14 oz) diced tomatoes','3 tbsp red curry paste','1 onion, diced','4 cloves garlic, minced','1 tbsp fresh ginger, grated','2 tbsp olive oil','Salt and pepper','Lime juice, fresh cilantro and rice or naan to serve'],instructions:['Set Instant Pot to sauté. Heat oil, cook onion until soft, 4 minutes. Add garlic, ginger and curry paste, cook 1 minute.','Add lentils, coconut milk, broth and diced tomatoes. Stir.','Seal the lid and cook on High Pressure 8 minutes.','Natural release 10 minutes, then quick release remaining pressure.','Stir and mash slightly for a creamy consistency. Season with salt and pepper.','Serve over rice or with naan, topped with lime juice and cilantro.'],timesMade:0,isEasy:true},
                {id:2078,collection:'pinch-of-yum',name:'Chicken Pot Pie with Biscuits',prepTime:'20 min',cookTime:40,servings:8,costPerServing:3.8,macros:{calories:480,protein:28,carbs:40,fat:22,fiber:3,sugar:5,sodium:620},tags:['Dinner','Comfort Food'],image:'https://pinchofyum.com/tachyon/Best-Chicken-Pot-Pie-with-Biscuits.jpg',ingredients:['3 cups cooked chicken, shredded or diced','2 cups frozen mixed vegetables (peas, carrots, corn)','1 onion, diced','3 cloves garlic, minced','4 tbsp butter','4 tbsp flour','2 cups chicken broth','1 cup whole milk','Salt, pepper, fresh thyme','1 can refrigerated biscuits (8 count)'],instructions:['Preheat oven to 375°F.','Melt butter in a large oven-safe skillet over medium heat. Cook onion 4 minutes. Add garlic, cook 1 minute.','Stir in flour and cook 2 minutes. Gradually whisk in broth and milk.','Simmer until thickened, 5 minutes. Season with salt, pepper and thyme.','Stir in chicken and frozen vegetables.','Arrange biscuits on top of the filling.','Bake 25–30 minutes until biscuits are golden and filling is bubbling.'],timesMade:0,isEasy:true},
                {id:2079,collection:'pinch-of-yum',name:'The Best Swedish Meatballs',prepTime:'20 min',cookTime:30,servings:6,costPerServing:4.2,macros:{calories:490,protein:30,carbs:28,fat:28,fiber:1,sugar:4,sodium:580},tags:['Dinner','Comfort Food'],image:'https://pinchofyum.com/tachyon/Swedish-Meatballs-in-Gravy.jpg',ingredients:['1 lb ground beef','1/2 lb ground pork','1/2 cup breadcrumbs','1/4 cup milk','1 egg','1 small onion, grated','1/2 tsp allspice','1/4 tsp nutmeg','Salt and pepper','Gravy: 4 tbsp butter, 3 tbsp flour, 2 cups beef broth, 1 cup sour cream, 1 tbsp Worcestershire, salt and pepper','Egg noodles and fresh parsley to serve'],instructions:['Soak breadcrumbs in milk 5 minutes.','Mix ground beef, pork, egg, soaked breadcrumbs, grated onion, allspice, nutmeg, salt and pepper. Form into 1-inch meatballs.','Brown meatballs in a skillet with butter in batches. Transfer to a plate.','In the same skillet, melt remaining butter and whisk in flour. Cook 2 minutes. Gradually add broth, whisking until smooth.','Add Worcestershire, season with salt and pepper. Simmer until thickened.','Reduce heat to low, stir in sour cream.','Return meatballs to the gravy and simmer 5 minutes.','Serve over egg noodles with fresh parsley.'],timesMade:0,isEasy:false},
                {id:2080,collection:'pinch-of-yum',name:'Coconut Curry Salmon',prepTime:'10 min',cookTime:20,servings:4,costPerServing:9.0,macros:{calories:420,protein:36,carbs:12,fat:26,fiber:2,sugar:5,sodium:480},tags:['Dinner','Healthy','Gluten-Free'],image:'https://pinchofyum.com/tachyon/Coconut-Curry-Salmon.jpg',ingredients:['4 salmon fillets (6 oz each)','1 can (14 oz) coconut milk','3 tbsp red curry paste','1 shallot, minced','3 cloves garlic, minced','1 tsp fresh ginger, grated','1 tbsp fish sauce','1 tbsp brown sugar','2 cups baby spinach','Juice of 1 lime','Rice and cilantro to serve'],instructions:['Season salmon with salt and pepper.','Heat a drizzle of oil in a large skillet over medium-high heat. Sear salmon 3–4 minutes skin-side up until golden. Flip and cook 1 more minute. Remove and set aside.','In the same pan, cook shallot, garlic and ginger over medium heat, 2 minutes.','Stir in curry paste and cook 1 minute until fragrant.','Add coconut milk, fish sauce and brown sugar. Simmer 5 minutes.','Stir in spinach until wilted. Add lime juice.','Return salmon to the pan, spoon sauce over top, and simmer 2 more minutes.','Serve over rice topped with cilantro.'],timesMade:0,isEasy:true},
                {id:2081,collection:'half-baked-harvest',name:'Crockpot Salsa Verde Chicken Tortilla Bowl',prepTime:'10 min',cookTime:360,servings:6,costPerServing:3.8,macros:{calories:390,protein:34,carbs:36,fat:12,fiber:6,sugar:4,sodium:640},tags:['Dinner','Gluten-Free','Easy'],image:'https://www.halfbakedharvest.com/wp-content/uploads/2025/02/Crockpot-Salsa-Verde-Chicken-Tortilla-Bowl-1-340x510.jpg',ingredients:['2 lb chicken breast','1 jar (16 oz) salsa verde','1 can (15 oz) black beans, drained','1 cup frozen corn','1 tsp cumin','1 tsp chili powder','Salt and pepper','Cooked rice or cilantro-lime rice','Toppings: crushed tortilla chips, shredded cheese, sour cream, avocado, pickled jalapeños, cilantro, lime'],instructions:['Place chicken in the slow cooker. Add salsa verde, cumin, chili powder, salt and pepper.','Cook on low 6 hours or high 3–4 hours until chicken is tender.','Shred chicken with two forks directly in the pot and stir into the juices.','Stir in black beans and corn. Cook 15 more minutes on low until warmed through.','Build bowls: start with rice, then pile on the chicken mixture.','Top with crushed chips, cheese, sour cream, avocado, jalapeños, cilantro and lime.'],timesMade:0,isEasy:true},
                {id:2082,collection:'half-baked-harvest',name:'25 Minute Tzatziki Gyro Rice Bowls',prepTime:'10 min',cookTime:15,servings:4,costPerServing:5.5,macros:{calories:460,protein:36,carbs:42,fat:16,fiber:3,sugar:5,sodium:560},tags:['Dinner','Easy','Gluten-Free'],image:'https://www.halfbakedharvest.com/wp-content/uploads/2025/02/25-Minute-Tzatziki-Gyro-Rice-Bowls-1-1-340x510.jpg',ingredients:['1.5 lb ground lamb or beef','1 small onion, grated','3 cloves garlic, minced','1 tsp dried oregano','1 tsp cumin','1/2 tsp cinnamon','Salt and pepper','2 cups rice, cooked','Tzatziki (store-bought or homemade)','Toppings: cherry tomatoes, cucumber, red onion, Kalamata olives, feta, fresh dill, pita chips'],instructions:['Combine meat, grated onion, garlic, oregano, cumin, cinnamon, salt and pepper.','Cook in a large skillet over medium-high heat, breaking into small crumbles, until nicely browned and a little crispy on the edges, 10–12 minutes.','Taste and adjust seasoning.','Build bowls: rice base, seasoned meat, then all the toppings you want.','Finish with a big scoop of tzatziki and pita chips on the side.'],timesMade:0,isEasy:true},
                {id:2083,collection:'half-baked-harvest',name:'Homemade Hostess Cupcakes',prepTime:'30 min',cookTime:20,servings:12,costPerServing:1.8,macros:{calories:380,protein:5,carbs:50,fat:18,fiber:2,sugar:34,sodium:220},tags:['Dessert'],image:'https://www.halfbakedharvest.com/wp-content/uploads/2025/02/Homemade-Hostess-Cupcakes-1-340x510.jpg',ingredients:['1.5 cups all-purpose flour','1/2 cup cocoa powder','1.5 tsp baking soda','1/2 tsp salt','1 cup sugar','2 eggs','1 cup buttermilk','1/2 cup vegetable oil','1 tsp vanilla extract','Cream filling: 1 cup heavy cream, 3 tbsp powdered sugar, 1 tsp vanilla','Chocolate ganache: 1 cup dark chocolate chips, 1/2 cup heavy cream'],instructions:['Preheat oven to 350°F. Line a muffin tin with cupcake liners.','Whisk together flour, cocoa, baking soda, salt and sugar.','In another bowl, whisk eggs, buttermilk, oil and vanilla. Combine wet and dry ingredients until just smooth.','Fill liners 2/3 full. Bake 18–20 minutes. Cool completely.','Whip cream with powdered sugar and vanilla to stiff peaks. Transfer to a piping bag.','Core the center of each cupcake and pipe in the cream filling.','Make ganache: heat cream just until it simmers, pour over chocolate chips. Stir until smooth. Cool slightly.','Dip each cupcake top in ganache. Let set, then pipe the signature squiggle in white chocolate or whipped cream.'],timesMade:0,isEasy:false},
                {id:2084,collection:'half-baked-harvest',name:'Crockpot Honey Garlic Chicken and Broccoli',prepTime:'10 min',cookTime:240,servings:6,costPerServing:4.2,macros:{calories:380,protein:36,carbs:32,fat:10,fiber:3,sugar:18,sodium:640},tags:['Dinner','Gluten-Free','Easy'],image:'https://www.halfbakedharvest.com/wp-content/uploads/2025/02/Crockpot-Honey-Garlic-Chicken-1-340x510.jpg',ingredients:['2 lb chicken thighs, boneless','1/2 cup honey','1/3 cup low-sodium soy sauce','6 cloves garlic, minced','1 tsp fresh ginger, grated','1 tsp sesame oil','1/4 tsp red pepper flakes','2 tbsp cornstarch mixed with 2 tbsp water','4 cups broccoli florets','Sesame seeds, green onions and rice to serve'],instructions:['Place chicken in the slow cooker.','Whisk together honey, soy sauce, garlic, ginger, sesame oil and red pepper flakes. Pour over chicken.','Cook on low 4 hours or high 2–3 hours until chicken is cooked through.','Remove chicken and shred or chop.','Stir cornstarch slurry into the sauce in the slow cooker. Add broccoli. Cook on high 20 minutes until sauce thickens and broccoli is tender.','Return chicken to the pot and stir.','Serve over rice with sesame seeds and green onions.'],timesMade:0,isEasy:true},
                {id:2085,collection:'half-baked-harvest',name:'Baked Garlic Parmesan Boneless Wings',prepTime:'15 min',cookTime:30,servings:4,costPerServing:4.5,macros:{calories:460,protein:40,carbs:22,fat:22,fiber:1,sugar:2,sodium:620},tags:['Dinner','Appetizer','Easy'],image:'https://www.halfbakedharvest.com/wp-content/uploads/2025/02/Baked-Garlic-Parmesan-Boneless-Wings-1-340x510.jpg',ingredients:['1.5 lb chicken breast, cut into chunks','1/2 cup flour','2 eggs, beaten','1 cup panko breadcrumbs','Salt and pepper','Garlic Parmesan sauce: 4 tbsp butter, 4 cloves garlic minced, 1/3 cup Parmesan grated, 2 tbsp fresh parsley, 1 tbsp lemon juice','Ranch or blue cheese for dipping'],instructions:['Preheat oven to 425°F. Line a baking sheet with a wire rack.','Set up breading station: flour in one bowl, eggs in a second, panko in a third. Season all with salt and pepper.','Bread each chicken piece: flour, then egg, then panko. Press firmly.','Bake 25–28 minutes until golden and cooked through, flipping halfway.','Meanwhile, melt butter in a small saucepan. Cook garlic 1 minute. Remove from heat, stir in Parmesan, parsley and lemon juice.','Toss baked chicken pieces in the garlic Parmesan sauce.','Serve with ranch or blue cheese.'],timesMade:0,isEasy:true},
                {id:2086,collection:'half-baked-harvest',name:'Brown Butter Banana Cake with Chocolate Caramel Frosting',prepTime:'30 min',cookTime:35,servings:12,costPerServing:2.2,macros:{calories:440,protein:5,carbs:58,fat:22,fiber:2,sugar:40,sodium:260},tags:['Dessert'],image:'https://www.halfbakedharvest.com/wp-content/uploads/2025/02/Brown-Butter-Banana-Cake-with-Chocolate-Caramel-Frosting-1-340x510.jpg',ingredients:['3 very ripe bananas, mashed','1/2 cup butter (for browning)','1.5 cups flour','1 tsp baking soda','1/2 tsp cinnamon','1/4 tsp salt','3/4 cup brown sugar','2 eggs','1 tsp vanilla','1/2 cup sour cream','Chocolate Caramel Frosting: 1/2 cup butter, 1 cup dark chocolate chips, 1/2 cup caramel sauce, 2 cups powdered sugar'],instructions:['Preheat oven to 350°F. Grease a 9x13 pan.','Brown butter in a saucepan over medium heat until nutty and golden. Cool slightly.','Whisk together flour, baking soda, cinnamon and salt.','Beat browned butter and brown sugar. Add eggs, vanilla and mashed bananas.','Mix in sour cream, then fold in dry ingredients until just combined.','Pour into prepared pan and bake 30–35 minutes. Cool completely.','For frosting: melt chocolate and butter together. Stir in caramel. Whisk in powdered sugar until smooth.','Spread frosting over cooled cake.'],timesMade:0,isEasy:false},
                {id:2087,collection:'half-baked-harvest',name:'Crockpot Buffalo Chicken Chili',prepTime:'10 min',cookTime:360,servings:6,costPerServing:3.5,macros:{calories:360,protein:36,carbs:24,fat:14,fiber:6,sugar:4,sodium:820},tags:['Dinner','Soup','Gluten-Free','Easy'],image:'https://www.halfbakedharvest.com/wp-content/uploads/2024/02/Crockpot-Buffalo-Chicken-Chili-1-340x510.jpg',ingredients:['1.5 lb chicken breast','2 cans (15 oz each) white beans, drained','1 can (14 oz) diced tomatoes','2 cups chicken broth','1/2 cup buffalo hot sauce','1 packet ranch seasoning','1 tsp garlic powder','1 tsp onion powder','Toppings: blue cheese or ranch dressing, celery, shredded cheddar, green onions, tortilla chips'],instructions:['Add chicken, beans, diced tomatoes, broth, buffalo sauce, ranch seasoning, garlic powder and onion powder to the slow cooker.','Cook on low 6 hours or high 3–4 hours until chicken is cooked through.','Remove chicken and shred with two forks. Return to the pot and stir.','Taste and add more buffalo sauce if desired.','Serve topped with blue cheese or ranch, celery, cheddar, green onions and tortilla chips.'],timesMade:0,isEasy:true},
                {id:2088,collection:'half-baked-harvest',name:'Easy Chocolate Truffles',prepTime:'20 min',cookTime:5,servings:24,costPerServing:0.8,macros:{calories:120,protein:1,carbs:12,fat:8,fiber:1,sugar:10,sodium:15},tags:['Dessert','Easy'],image:'https://www.halfbakedharvest.com/wp-content/uploads/2024/02/Easy-Chocolate-Truffles-1-340x510.jpg',ingredients:['12 oz high-quality dark chocolate, finely chopped','3/4 cup heavy cream','2 tbsp unsalted butter','1 tsp vanilla extract','Pinch of sea salt','Coatings: cocoa powder, crushed nuts, sprinkles, shredded coconut'],instructions:['Place chopped chocolate in a bowl.','Heat cream just until it simmers. Pour over chocolate and let sit 2 minutes without stirring.','Add butter, vanilla and salt. Stir slowly from the center outward until completely smooth and glossy.','Cover and refrigerate 2 hours or until firm enough to scoop.','Use a small scoop or tablespoon to portion the ganache. Roll quickly between your palms into balls.','Immediately roll in your desired coating: cocoa powder, nuts, sprinkles or coconut.','Keep refrigerated until ready to serve.'],timesMade:0,isEasy:true},
                {id:2089,collection:'half-baked-harvest',name:'Sheet Pan Korean Popcorn Chicken',prepTime:'20 min',cookTime:25,servings:4,costPerServing:4.5,macros:{calories:420,protein:34,carbs:38,fat:14,fiber:2,sugar:14,sodium:780},tags:['Dinner','Asian','Easy'],image:'https://www.halfbakedharvest.com/wp-content/uploads/2024/02/Sheet-Pan-Korean-Popcorn-Chicken-1-340x510.jpg',ingredients:['1.5 lb chicken breast, cut into 1-inch pieces','1/2 cup cornstarch','2 eggs, beaten','Salt and pepper','Korean sauce: 3 tbsp gochujang, 2 tbsp soy sauce, 2 tbsp honey, 1 tbsp sesame oil, 1 tbsp rice vinegar, 2 cloves garlic minced','Sesame seeds, green onions and rice to serve'],instructions:['Preheat oven to 425°F with a rack in the upper position.','Season chicken with salt and pepper. Toss in cornstarch, then dip in egg, then back in cornstarch for a double coat.','Spread on a greased baking sheet. Spray the chicken with oil spray.','Bake 20–22 minutes until golden, flipping halfway.','Whisk together all Korean sauce ingredients.','Toss hot chicken in the sauce immediately.','Serve over rice topped with sesame seeds and green onions.'],timesMade:0,isEasy:true},
                {id:2090,collection:'half-baked-harvest',name:'30 Minute Thai Basil Beef Noodles',prepTime:'10 min',cookTime:20,servings:4,costPerServing:4.8,macros:{calories:510,protein:32,carbs:52,fat:18,fiber:3,sugar:10,sodium:860},tags:['Dinner','Asian','Easy'],image:'https://www.halfbakedharvest.com/wp-content/uploads/2024/02/30-Minute-Thai-Basil-Beef-Noodles-1-340x510.jpg',ingredients:['1 lb ground beef','8 oz rice noodles or lo mein','4 cloves garlic, minced','1 shallot, minced','1 red chili, sliced (or 1/2 tsp red pepper flakes)','Sauce: 3 tbsp soy sauce, 2 tbsp oyster sauce, 1 tbsp fish sauce, 1 tbsp brown sugar, 1 tsp sesame oil','1 cup fresh Thai basil leaves','2 eggs','Lime wedges and extra chili to serve'],instructions:['Cook noodles per package directions. Drain and rinse with cold water.','Whisk together all sauce ingredients.','Heat a wok or large skillet over high heat with a drizzle of oil. Brown ground beef, breaking it apart, until crispy on the edges.','Push beef to the side. Add garlic, shallot and chili, cook 1 minute.','Add noodles and sauce, toss everything together over high heat.','Push noodles to the side, crack in eggs and scramble quickly, then fold into the noodles.','Remove from heat and fold in Thai basil. Serve with lime wedges.'],timesMade:0,isEasy:true},
                {id:2131,collection:'minimalist-baker',name:'Chocolate Tahini Cookies',prepTime:'10 min',cookTime:12,servings:16,costPerServing:0.7,macros:{calories:150,protein:3,carbs:16,fat:9,fiber:2,sugar:10,sodium:80},tags:['Dessert','Vegan','Gluten-Free','Easy'],image:'https://minimalistbaker.com/wp-content/uploads/2025/06/Fudgy-Vegan-Chocolate-Tahini-Cookies-7-500x750.jpg',ingredients:['1/2 cup tahini','1/4 cup maple syrup','1 tsp vanilla','1/4 cup cocoa powder','3/4 cup oat flour (gluten-free if needed)','1/4 tsp baking soda','Pinch of salt','1/3 cup dark chocolate chips','Flaky sea salt for topping'],instructions:['Preheat oven to 350°F. Line a baking sheet with parchment.','Stir together tahini, maple syrup and vanilla until smooth.','Add cocoa powder, oat flour, baking soda and salt. Mix until a dough forms.','Fold in chocolate chips.','Scoop into 1-tbsp balls and place 2 inches apart on the sheet. Flatten slightly with your palm.','Sprinkle with flaky sea salt.','Bake 10–12 minutes — they will look slightly underdone but will firm up as they cool.','Cool on the pan 10 minutes before moving.'],timesMade:0,isEasy:true},
                {id:2133,collection:'minimalist-baker',name:'Curried Black Eyed Pea Soup',prepTime:'10 min',cookTime:30,servings:4,costPerServing:2.2,macros:{calories:300,protein:12,carbs:40,fat:10,fiber:8,sugar:6,sodium:480},tags:['Dinner','Vegan','Gluten-Free','Easy'],image:'https://minimalistbaker.com/wp-content/uploads/2025/06/Creamy-Curried-Vegan-Black-Eyed-Bean-Soup-8-500x750.jpg',ingredients:['2 cans (15 oz each) black-eyed peas, drained','1 can (14 oz) coconut milk','1 can (14 oz) diced tomatoes','1 onion, diced','4 cloves garlic, minced','1 tbsp fresh ginger, grated','2 tbsp red curry paste','1 tsp turmeric','1 tsp cumin','2 tbsp coconut oil','2 cups vegetable broth','Salt and pepper','Fresh cilantro, lime and rice to serve'],instructions:['Heat coconut oil in a large pot over medium heat. Cook onion 5 minutes until soft.','Add garlic, ginger, curry paste, turmeric and cumin. Cook 2 minutes until very fragrant.','Add diced tomatoes and cook 2 minutes, stirring to deglaze the pot.','Pour in black-eyed peas, coconut milk and broth. Stir and bring to a simmer.','Cook 15–20 minutes to let flavors develop.','Use an immersion blender to partially blend — aim for a thick, creamy base with some whole peas remaining.','Season with salt and pepper. Serve over rice with cilantro and a squeeze of lime.'],timesMade:0,isEasy:true},
                {id:2134,collection:'minimalist-baker',name:'Tahini Hot Chocolate',prepTime:'5 min',cookTime:5,servings:2,costPerServing:1.8,macros:{calories:220,protein:5,carbs:22,fat:12,fiber:3,sugar:14,sodium:80},tags:['Drink','Vegan','Gluten-Free','Easy'],image:'https://minimalistbaker.com/wp-content/uploads/2025/06/Tahini-Hot-Chocolate-6-500x750.jpg',ingredients:['2 cups oat milk or milk of choice','3 tbsp cocoa powder','2 tbsp tahini','2 tbsp maple syrup','1/4 tsp vanilla extract','Pinch of cinnamon','Pinch of salt','Optional: pinch of cayenne for a kick'],instructions:['Add all ingredients to a small saucepan over medium heat.','Whisk continuously until everything is smooth and combined and the milk is steaming — do not let it boil.','Taste and adjust sweetness or tahini to your preference.','Pour into mugs. For extra froth, blend in a high-speed blender for 30 seconds before serving.','Top with a sprinkle of cinnamon or a drizzle of extra tahini.'],timesMade:0,isEasy:true},
                {id:2135,collection:'minimalist-baker',name:'Thanksgiving Turkey Meatballs',prepTime:'20 min',cookTime:25,servings:6,costPerServing:3.5,macros:{calories:320,protein:28,carbs:18,fat:14,fiber:2,sugar:4,sodium:480},tags:['Dinner','Easy'],image:'https://minimalistbaker.com/wp-content/uploads/2023/10/Baked-Thanksgiving-Turkey-Meatballs-7-500x750.jpg',ingredients:['1.5 lb ground turkey','1/3 cup breadcrumbs','1 egg','3 cloves garlic, minced','1/4 cup fresh parsley, chopped','1 tsp dried sage','1/2 tsp dried thyme','1/2 tsp dried rosemary','1/2 tsp onion powder','Salt and pepper','Gravy or cranberry sauce to serve'],instructions:['Preheat oven to 400°F. Line a baking sheet with parchment.','Combine all ingredients in a bowl. Mix gently until just combined — overmixing makes tough meatballs.','Roll into 1.5-inch meatballs and place on the baking sheet.','Bake 20–22 minutes until cooked through and golden.','Serve over mashed potatoes with gravy, or alongside cranberry sauce for a full Thanksgiving-inspired plate.'],timesMade:0,isEasy:true},
                {id:2136,collection:'minimalist-baker',name:'Cranberry Orange Cookie Bars',prepTime:'20 min',cookTime:25,servings:16,costPerServing:0.8,macros:{calories:180,protein:2,carbs:26,fat:8,fiber:2,sugar:14,sodium:90},tags:['Dessert','Vegan','Gluten-Free','Easy'],image:'https://minimalistbaker.com/wp-content/uploads/2023/09/Vegan-Gluten-Free-Cranberry-Orange-Cookie-Bars-9-500x750.jpg',ingredients:['1.5 cups almond flour','1/2 cup oat flour','1/4 tsp salt','1/4 tsp baking soda','1/3 cup coconut oil, melted','1/4 cup maple syrup','1 tsp vanilla','1 orange, zested and juiced','1 cup fresh or frozen cranberries, halved','2 tbsp sugar (for cranberries)'],instructions:['Preheat oven to 350°F. Line an 8x8 pan with parchment.','Toss cranberries with sugar and set aside.','Whisk together almond flour, oat flour, salt and baking soda.','Mix in coconut oil, maple syrup, vanilla and orange zest until a dough forms.','Press 2/3 of the dough evenly into the pan.','Scatter the sugared cranberries over the base. Drizzle with 1 tbsp orange juice.','Crumble remaining dough on top.','Bake 22–25 minutes until golden. Cool completely before cutting into bars.'],timesMade:0,isEasy:true},
                {id:2137,collection:'minimalist-baker',name:'Kabocha Chickpea Miso Soup',prepTime:'15 min',cookTime:25,servings:4,costPerServing:3.2,macros:{calories:260,protein:10,carbs:38,fat:7,fiber:8,sugar:6,sodium:640},tags:['Dinner','Vegan','Gluten-Free','Easy'],image:'https://minimalistbaker.com/wp-content/uploads/2023/11/1-Pot-Kabocha-Chickpea-Miso-Soup-25-Minimalist-Baker-110323-500x750.jpg',ingredients:['1/2 small kabocha squash, seeded and cubed (about 3 cups)','1 can (15 oz) chickpeas, drained','4 cups vegetable broth','1 cup water','3 tbsp white miso paste','1 tbsp sesame oil','1 onion, diced','3 cloves garlic, minced','1 tsp fresh ginger, grated','2 cups kale or spinach','Sesame seeds and green onions to serve'],instructions:['Heat sesame oil in a large pot over medium heat. Cook onion 4 minutes until soft.','Add garlic and ginger, cook 1 minute.','Add kabocha squash, chickpeas, broth and water. Bring to a boil.','Reduce heat and simmer 15–18 minutes until squash is completely tender.','Ladle a little broth into a small bowl, whisk in miso paste until dissolved, then stir back into the pot — do not boil after adding miso.','Add kale and stir until wilted.','Serve topped with sesame seeds and green onions.'],timesMade:0,isEasy:true},
                {id:2138,collection:'minimalist-baker',name:'Easy Gluten-Free Monster Cookies',prepTime:'15 min',cookTime:12,servings:18,costPerServing:0.6,macros:{calories:180,protein:5,carbs:22,fat:9,fiber:2,sugar:14,sodium:100},tags:['Dessert','Gluten-Free','Easy'],image:'https://minimalistbaker.com/wp-content/uploads/2025/02/Easy-Gluten-Free-Monster-Cookies-7-500x750.jpg',ingredients:['1 cup creamy peanut butter','1/2 cup brown sugar','1/4 cup granulated sugar','2 eggs','1 tsp vanilla','1 tsp baking soda','2.5 cups rolled oats (certified GF)','1/2 cup chocolate chips','1/2 cup M&Ms or more chocolate chips'],instructions:['Preheat oven to 350°F. Line baking sheets with parchment.','Beat together peanut butter, brown sugar and granulated sugar until smooth.','Mix in eggs, vanilla and baking soda.','Stir in oats until a thick dough forms.','Fold in chocolate chips and M&Ms.','Scoop into 2-tbsp balls and place 2 inches apart. Flatten slightly.','Bake 10–12 minutes until edges are set but centers look slightly underdone.','Cool on the pan 5 minutes — they firm up as they cool.'],timesMade:0,isEasy:true},
                {id:2139,collection:'minimalist-baker',name:'Instant Chai Latte Mix',prepTime:'10 min',cookTime:0,servings:20,costPerServing:0.4,macros:{calories:30,protein:0,carbs:7,fat:0,fiber:0,sugar:6,sodium:5},tags:['Drink','Vegan','Gluten-Free','Easy'],image:'https://minimalistbaker.com/wp-content/uploads/2025/06/Instant-Chai-Latte-Mix-8-500x750.jpg',ingredients:['1/4 cup ground cinnamon','2 tbsp ground ginger','2 tbsp ground cardamom','1 tbsp ground cloves','1 tbsp ground allspice','1 tsp black pepper','1/4 cup powdered sugar or coconut sugar (optional for a sweetened mix)'],instructions:['Combine all spices (and sugar if using) in a jar and stir or shake until evenly mixed.','To make one chai latte: add 1–2 tsp of the mix to 8 oz hot milk of choice. Stir well.','Sweeten with honey or maple syrup to taste if you left out the sugar in the mix.','For an iced version, mix with a little hot water first to dissolve, then pour over ice and add cold milk.','Store in an airtight jar in a cool, dark place for up to 6 months.'],timesMade:0,isEasy:true},
                {id:2140,collection:'minimalist-baker',name:'Gluten-Free Pita',prepTime:'20 min',cookTime:15,servings:6,costPerServing:0.8,macros:{calories:220,protein:5,carbs:38,fat:6,fiber:3,sugar:1,sodium:300},tags:['Bread','Vegan','Gluten-Free'],image:'https://minimalistbaker.com/wp-content/uploads/2025/08/Pillowy-Gluten-Free-Pita-Aran-Goyoaga-12-500x750.jpg',ingredients:['1.5 cups gluten-free all-purpose flour blend (one with xanthan gum)','1/2 cup tapioca starch','1 tsp instant yeast','1 tsp salt','1 tsp sugar','3/4 cup warm water','2 tbsp olive oil','1 tbsp apple cider vinegar'],instructions:['Whisk together flour, tapioca starch, yeast, salt and sugar in a large bowl.','Add warm water, olive oil and vinegar. Mix until a smooth, slightly sticky dough forms.','Cover and let rest 45 minutes in a warm spot.','Divide into 6 equal pieces. Roll each between two sheets of parchment to about 1/4 inch thick.','Heat a cast iron skillet or heavy pan over medium-high heat. No oil needed.','Cook each pita 2–3 minutes per side until puffed and lightly charred in spots.','Wrap in a clean towel to keep soft. Best eaten warm but can be reheated.'],timesMade:0,isEasy:false},
                {id:2132,collection:'minimalist-baker',name:'Vegan Gluten-Free Morning Glory Muffins',prepTime:'15 min',cookTime:25,servings:12,costPerServing:0.8,macros:{calories:200,protein:4,carbs:28,fat:9,fiber:3,sugar:14,sodium:180},tags:['Breakfast','Vegan','Gluten-Free','Easy'],image:'https://minimalistbaker.com/wp-content/uploads/2024/01/Vegan-Gluten-Free-Morning-Glory-Muffins-10-500x750.jpg',ingredients:['1.5 cups gluten-free oat flour','1 tsp baking soda','1.5 tsp cinnamon','1/4 tsp salt','1/2 cup maple syrup','1/3 cup coconut oil, melted','2 flax eggs (2 tbsp ground flax + 6 tbsp water, rested 5 min)','1 tsp vanilla','1 cup shredded carrots','1 apple, peeled and grated','1/3 cup raisins','1/4 cup chopped walnuts','1/4 cup shredded coconut'],instructions:['Preheat oven to 375°F. Line a muffin tin.','Prepare flax eggs and let sit 5 minutes to gel.','Whisk together oat flour, baking soda, cinnamon and salt.','In another bowl, mix maple syrup, coconut oil, flax eggs and vanilla.','Stir wet into dry until just combined.','Fold in carrots, apple, raisins, walnuts and coconut.','Divide into 12 muffin cups — fill them generously.','Bake 22–25 minutes until a toothpick comes out clean. Cool completely before eating.'],timesMade:0,isEasy:true},
                {id:2141,collection:'ambitious-kitchen',name:'Peanut Butter Banana Baked Oatmeal Cups',prepTime:'10 min',cookTime:25,servings:12,costPerServing:0.8,macros:{calories:180,protein:6,carbs:22,fat:8,fiber:3,sugar:8,sodium:120},tags:['Breakfast','Vegetarian','Easy','Meal Prep'],image:'https://www.ambitiouskitchen.com/wp-content/uploads/2019/12/pbbananabakedoatmealcups-4-375x375.jpg',ingredients:['2 cups rolled oats','1 tsp baking powder','1/2 tsp cinnamon','1/4 tsp salt','2 ripe bananas, mashed','1/2 cup peanut butter','1/3 cup honey or maple syrup','2 eggs','1 cup milk of choice','1 tsp vanilla extract','1/3 cup mini chocolate chips (optional)'],instructions:['Preheat oven to 350°F. Grease a 12-cup muffin tin well.','Whisk together oats, baking powder, cinnamon and salt in a large bowl.','In another bowl, mix mashed banana, peanut butter, honey, eggs, milk and vanilla until smooth.','Pour wet ingredients into dry and stir to combine. Fold in chocolate chips if using.','Divide evenly among the muffin cups — they should be about 3/4 full.','Bake 22–25 minutes until set and lightly golden on top.','Cool 10 minutes in the pan before removing. Store in the fridge up to 5 days or freeze up to 3 months.'],timesMade:0,isEasy:true},
                {id:2142,collection:'ambitious-kitchen',name:'Snickerdoodle Tahini Date Smoothie',prepTime:'5 min',cookTime:0,servings:1,costPerServing:3.5,macros:{calories:420,protein:12,carbs:58,fat:18,fiber:6,sugar:36,sodium:120},tags:['Breakfast','Vegan','Gluten-Free','Easy'],image:'https://www.ambitiouskitchen.com/wp-content/uploads/2020/03/Snickerdoodle-Tahini-Date-Smoothie-4-375x375.jpg',ingredients:['2 Medjool dates, pitted','2 tbsp tahini','1 frozen banana','1 cup milk of choice (oat or almond works great)','1/2 tsp cinnamon','1/4 tsp vanilla extract','Pinch of salt','4–5 ice cubes'],instructions:['Add all ingredients to a blender.','Blend on high until completely smooth and creamy, about 60 seconds.','Taste and adjust — add more cinnamon for spice, more date for sweetness, or more milk to thin.','Pour and serve immediately. Tastes like a snickerdoodle cookie in smoothie form.'],timesMade:0,isEasy:true},
                {id:2143,collection:'ambitious-kitchen',name:'Moroccan-Spiced Greek Yogurt Chicken Salad',prepTime:'15 min',cookTime:0,servings:4,costPerServing:3.8,macros:{calories:280,protein:30,carbs:16,fat:10,fiber:3,sugar:8,sodium:340},tags:['Lunch','Healthy','Gluten-Free','Easy'],image:'https://www.ambitiouskitchen.com/wp-content/uploads/2019/06/Moroccan-Chicken-Salad-4-375x375.jpg',ingredients:['2 cups cooked chicken breast, shredded or diced','1/2 cup plain Greek yogurt','1/4 cup golden raisins','1/4 cup slivered almonds','1/4 cup fresh cilantro or parsley, chopped','2 green onions, sliced','1 tsp cumin','1/2 tsp cinnamon','1/2 tsp smoked paprika','1/4 tsp turmeric','1/4 tsp ginger','1 lemon, juiced','Salt and pepper','Pita, lettuce cups or crackers to serve'],instructions:['Combine cumin, cinnamon, paprika, turmeric and ginger in a small bowl.','In a large bowl, mix Greek yogurt, lemon juice and the spice blend until smooth.','Add chicken, raisins, almonds, cilantro and green onions. Toss to coat everything evenly.','Season with salt and pepper. Taste and adjust spices as needed.','Serve in pita pockets, lettuce cups or on crackers. Keeps in the fridge up to 4 days.'],timesMade:0,isEasy:true},
                {id:2144,collection:'ambitious-kitchen',name:'Sheet Pan Salmon with Potatoes and Chickpeas',prepTime:'10 min',cookTime:30,servings:4,costPerServing:8.5,macros:{calories:480,protein:40,carbs:36,fat:18,fiber:7,sugar:4,sodium:460},tags:['Dinner','Healthy','Gluten-Free','Easy'],image:'https://www.ambitiouskitchen.com/wp-content/uploads/2025/03/Sheet-Pan-Salmon-with-Potatoes-and-Chickpeas-5-375x375.jpg',ingredients:['4 salmon fillets (6 oz each)','1 lb baby potatoes, halved','1 can (15 oz) chickpeas, drained and dried well','3 tbsp olive oil','1 tsp smoked paprika','1 tsp garlic powder','1 tsp cumin','1/2 tsp turmeric','Salt and pepper','1 lemon, sliced','Fresh parsley and tzatziki or tahini sauce to serve'],instructions:['Preheat oven to 425°F. Line a large baking sheet with parchment.','Toss potatoes and chickpeas with 2 tbsp olive oil and all the spices. Spread on the baking sheet.','Roast 18 minutes, tossing halfway, until potatoes start to soften and chickpeas are crisping.','Push everything to the sides. Lay salmon fillets in the center, brush with remaining olive oil and season with salt and pepper. Top with lemon slices.','Roast 12–15 more minutes until salmon flakes easily.','Serve with fresh parsley and a drizzle of tahini or a scoop of tzatziki.'],timesMade:0,isEasy:true},
                {id:2145,collection:'ambitious-kitchen',name:'Grandma\'s Healthy Bran Muffins',prepTime:'10 min',cookTime:20,servings:12,costPerServing:0.6,macros:{calories:160,protein:4,carbs:28,fat:5,fiber:4,sugar:12,sodium:200},tags:['Breakfast','Vegetarian','Easy','Meal Prep'],image:'https://www.ambitiouskitchen.com/wp-content/uploads/2023/03/Grandmas-Healthy-Bran-Muffins-7-375x375.jpg',ingredients:['1.5 cups wheat bran','1 cup buttermilk','1/3 cup vegetable oil or melted coconut oil','1/3 cup brown sugar or honey','1 egg','1 tsp vanilla','1 cup whole wheat flour','1 tsp baking soda','1/2 tsp baking powder','1/4 tsp salt','1/2 cup raisins or blueberries (optional)'],instructions:['Preheat oven to 375°F. Line a muffin tin with liners or grease well.','Combine wheat bran and buttermilk in a large bowl. Let sit 5 minutes to soften.','Whisk in oil, brown sugar, egg and vanilla.','Add flour, baking soda, baking powder and salt. Stir until just combined — do not overmix.','Fold in raisins or blueberries if using.','Divide evenly into 12 muffin cups.','Bake 18–20 minutes until a toothpick comes out clean. Cool 5 minutes before removing.'],timesMade:0,isEasy:true},
                {id:2146,collection:'ambitious-kitchen',name:'Chicken Florentine Meatballs',prepTime:'15 min',cookTime:25,servings:4,costPerServing:4.5,macros:{calories:380,protein:36,carbs:12,fat:20,fiber:2,sugar:4,sodium:540},tags:['Dinner','Gluten-Free'],image:'https://www.ambitiouskitchen.com/wp-content/uploads/2026/01/Chicken-Florentine-Meatballs-5-375x375.jpg',ingredients:['1.5 lb ground chicken','1 cup frozen spinach, thawed and squeezed very dry','1/3 cup breadcrumbs or almond flour (for GF)','1 egg','3 cloves garlic, minced','1/4 cup Parmesan, grated','1/2 tsp Italian seasoning','Salt and pepper','Cream sauce: 2 tbsp butter, 3 cloves garlic, 1 cup chicken broth, 1/2 cup heavy cream, 1/2 cup Parmesan, 2 cups baby spinach, salt and pepper'],instructions:['Preheat oven to 400°F. Line a baking sheet with parchment.','Combine ground chicken, squeezed spinach, breadcrumbs, egg, garlic, Parmesan, Italian seasoning, salt and pepper. Mix gently and roll into 1.5-inch meatballs.','Bake 18–20 minutes until cooked through and golden.','While meatballs bake, melt butter in a skillet over medium heat. Cook garlic 1 minute. Add broth and simmer 2 minutes.','Stir in cream and Parmesan. Simmer until slightly thickened, 3–4 minutes.','Add spinach and stir until wilted. Season with salt and pepper.','Add baked meatballs to the sauce and serve over pasta, rice or with crusty bread.'],timesMade:0,isEasy:false},
                {id:2147,collection:'ambitious-kitchen',name:'Cottage Cheese Egg Bites',prepTime:'10 min',cookTime:25,servings:6,costPerServing:1.2,macros:{calories:140,protein:14,carbs:3,fat:8,fiber:0,sugar:2,sodium:280},tags:['Breakfast','Gluten-Free','Easy','Meal Prep'],image:'https://www.ambitiouskitchen.com/wp-content/uploads/2026/02/Cottage-Cheese-Egg-Bites-5-375x375.jpg',ingredients:['6 large eggs','1/2 cup cottage cheese','1/4 cup shredded cheese (cheddar, feta or Gruyere)','Salt and pepper','Mix-in options: diced bell pepper, spinach, bacon bits, sun-dried tomatoes, jalapeño, smoked salmon, everything bagel seasoning'],instructions:['Preheat oven to 325°F. Grease a silicone muffin mold or a standard muffin tin well.','Blend eggs and cottage cheese together until smooth — a blender or immersion blender works best for the silkiest texture.','Stir in shredded cheese, salt and pepper.','Add any mix-ins to each cup, then pour the egg mixture over to fill 3/4 full.','Bake 22–25 minutes until just set in the center with a slight jiggle.','Cool 5 minutes before removing. Refrigerate up to 5 days. Reheat 30–45 seconds in the microwave.'],timesMade:0,isEasy:true},
                {id:2148,collection:'ambitious-kitchen',name:'Healthy Chocolate Brownie Banana Bread',prepTime:'10 min',cookTime:55,servings:10,costPerServing:0.8,macros:{calories:210,protein:5,carbs:32,fat:8,fiber:3,sugar:14,sodium:180},tags:['Dessert','Breakfast','Vegetarian','Easy'],image:'https://www.ambitiouskitchen.com/wp-content/uploads/2020/04/Healthy-Chocolate-Banana-Bread-4-375x375.jpg',ingredients:['3 very ripe bananas, mashed','1/3 cup melted coconut oil or butter','1/3 cup honey or maple syrup','2 eggs','1 tsp vanilla','1 cup whole wheat flour or oat flour','1/3 cup cocoa powder','1 tsp baking soda','1/2 tsp salt','1/2 cup chocolate chips, plus more for topping'],instructions:['Preheat oven to 350°F. Grease a 9x5 loaf pan.','Whisk together mashed bananas, oil, honey, eggs and vanilla in a large bowl.','Add flour, cocoa powder, baking soda and salt. Stir until just combined — a few lumps are fine.','Fold in chocolate chips.','Pour into the loaf pan. Scatter extra chocolate chips on top.','Bake 50–58 minutes until a toothpick inserted in the center comes out with just a few moist crumbs.','Cool in the pan 15 minutes, then transfer to a wire rack. Slice when fully cool.'],timesMade:0,isEasy:true},
                {id:2149,collection:'ambitious-kitchen',name:'Lactation Snack Bites',prepTime:'15 min',cookTime:0,servings:20,costPerServing:0.6,macros:{calories:130,protein:4,carbs:14,fat:7,fiber:2,sugar:7,sodium:60},tags:['Snack','Vegetarian','No-Bake','Easy'],image:'https://www.ambitiouskitchen.com/wp-content/uploads/2022/12/breastfeeding-snacks-sq-375x375.png',ingredients:['2 cups rolled oats','1/2 cup peanut butter or almond butter','1/3 cup honey','1/3 cup ground flaxseed','1/4 cup chocolate chips','1/4 cup shredded coconut (optional)','1 tsp vanilla extract','Pinch of salt'],instructions:['Combine all ingredients in a large bowl and stir until fully mixed.','Refrigerate the mixture for 30 minutes — this makes it much easier to roll.','Roll into 1-inch balls using your hands.','Place on a parchment-lined tray.','Refrigerate at least 1 hour until firm. Store in the fridge up to 2 weeks or freeze up to 3 months.'],timesMade:0,isEasy:true},
                {id:2150,collection:'ambitious-kitchen',name:'Chocolate Chip Greek Yogurt Muffins',prepTime:'10 min',cookTime:20,servings:12,costPerServing:0.7,macros:{calories:190,protein:6,carbs:26,fat:7,fiber:1,sugar:12,sodium:180},tags:['Breakfast','Vegetarian','Easy','Meal Prep'],image:'https://www.ambitiouskitchen.com/wp-content/uploads/2020/02/Chocolate-Chip-Greek-Yogurt-Muffins-7-375x375.jpg',ingredients:['1.5 cups all-purpose flour','1 tsp baking powder','1/2 tsp baking soda','1/4 tsp salt','3/4 cup plain Greek yogurt','1/2 cup sugar','2 eggs','1/4 cup vegetable oil or melted butter','1 tsp vanilla extract','3/4 cup chocolate chips, divided'],instructions:['Preheat oven to 375°F. Line a muffin tin with liners.','Whisk together flour, baking powder, baking soda and salt.','In another bowl, whisk Greek yogurt, sugar, eggs, oil and vanilla until smooth.','Fold wet ingredients into dry until just combined.','Gently fold in 1/2 cup chocolate chips.','Divide evenly into 12 muffin cups. Top with remaining chips.','Bake 18–20 minutes until a toothpick comes out clean. Cool 5 minutes before serving.'],timesMade:0,isEasy:true},
                // Spend With Pennies
                {id:2011,collection:'spend-with-pennies',name:'Colcannon',prepTime:'15 min',cookTime:30,servings:6,costPerServing:2.50,macros:{calories:260,protein:5,carbs:38,fat:10,fiber:4,sugar:4,sodium:320},tags:['Side Dish','Vegetarian','Comfort Food'],image:'https://www.spendwithpennies.com/wp-content/uploads/2026/01/Colcannon-Recipe-SpendWithPennies-5-270x405.jpg',ingredients:['2 lb Yukon Gold potatoes, peeled and cubed','4 tbsp butter, plus more for serving','1/2 small head green cabbage, thinly sliced','1 small onion, thinly sliced','1/2 cup warm milk or cream','Salt and pepper to taste','Chives for garnish'],instructions:['Boil potatoes in salted water until fork-tender, about 20 minutes. Drain well.','While potatoes cook, melt butter in a skillet over medium heat. Add cabbage and onion, cook 8–10 minutes until soft and slightly golden.','Mash potatoes with warm milk until smooth and fluffy.','Fold the cabbage and onion mixture into the mashed potatoes.','Season generously with salt and pepper.','Serve with a well of butter in the center and a sprinkle of chives.'],timesMade:0,isEasy:true},
                {id:2012,collection:'spend-with-pennies',name:"Slow Cooker Shepherd's Pie",prepTime:'20 min',cookTime:240,servings:6,costPerServing:4.20,macros:{calories:410,protein:28,carbs:34,fat:18,fiber:5,sugar:5,sodium:730},tags:['Dinner','Comfort Food'],image:'https://www.spendwithpennies.com/wp-content/uploads/2026/01/Slow-Cooker-Shepherds-Pie-SpendWithPennies-10-270x405.jpg',ingredients:['1.5 lb ground beef or lamb','1 bag frozen mixed vegetables (peas, carrots, corn, green beans)','1 packet brown gravy mix','1 cup beef broth','1 tbsp Worcestershire sauce','1 tsp garlic powder','1 tsp onion powder','Salt and pepper','3 cups prepared mashed potatoes (from box or scratch)','1/2 cup shredded cheddar'],instructions:['Brown ground meat in a skillet, drain fat. Season with garlic powder, onion powder, salt and pepper.','Transfer to slow cooker. Add frozen vegetables.','Whisk together gravy mix, broth and Worcestershire sauce. Pour over meat and vegetables.','Cover and cook on high 3–4 hours or low 6–7 hours.','About 30 minutes before serving, spread mashed potatoes over the top, sprinkle with cheddar. Cover and cook until heated through.','Serve directly from the slow cooker.'],timesMade:0,isEasy:true},
                {id:2013,collection:'spend-with-pennies',name:'French Onion Baked Chicken',prepTime:'10 min',cookTime:25,servings:4,costPerServing:4.80,macros:{calories:390,protein:42,carbs:14,fat:18,fiber:1,sugar:2,sodium:620},tags:['Dinner','Easy'],image:'https://www.spendwithpennies.com/wp-content/uploads/2026/01/French-Onion-Baked-Chicken-SpendWithPennies-10-270x405.jpg',ingredients:['4 boneless skinless chicken breasts','2 tbsp Dijon mustard','1 egg, beaten','1.5 cups French fried onions, crushed','1/2 cup shredded Gruyere or Swiss cheese','Salt and pepper','Fresh thyme for garnish'],instructions:['Preheat oven to 400°F. Line a baking sheet with parchment.','Season chicken breasts with salt and pepper.','Mix together Dijon mustard and beaten egg in a shallow bowl.','Dip each chicken breast into the mustard-egg mixture, then press into the crushed fried onions to coat both sides.','Place on baking sheet and bake 20–22 minutes until cooked through.','Top with shredded cheese and broil 1–2 minutes until melted and bubbly.','Garnish with fresh thyme and serve.'],timesMade:0,isEasy:true},
                {id:2014,collection:'spend-with-pennies',name:'Beef Stroganoff',prepTime:'10 min',cookTime:25,servings:4,costPerServing:5.50,macros:{calories:540,protein:38,carbs:44,fat:22,fiber:2,sugar:4,sodium:590},tags:['Dinner','Comfort Food'],image:'https://www.spendwithpennies.com/wp-content/uploads/2025/09/1200-Beef-Stroganoff-5-SpendWithPennies-270x405.jpg',ingredients:['1.5 lb beef sirloin or tenderloin, sliced thin','8 oz mushrooms, sliced','1 onion, diced','3 cloves garlic, minced','2 tbsp butter','1 tbsp olive oil','1 cup beef broth','1 tbsp Worcestershire sauce','1 tsp Dijon mustard','1 cup sour cream','1 tbsp flour','12 oz egg noodles, cooked','Salt, pepper, parsley'],instructions:['Season beef strips generously with salt and pepper.','Heat oil in a large skillet over high heat. Sear beef in batches until browned, set aside.','In same pan, melt butter over medium heat. Cook onion and mushrooms 5–6 minutes until golden.','Add garlic, cook 1 minute more.','Sprinkle flour over mushrooms, stir to coat.','Pour in broth, Worcestershire and mustard. Scrape up any browned bits. Simmer 3–4 minutes until slightly thickened.','Reduce heat to low. Stir in sour cream until smooth.','Return beef to pan and heat through — do not boil.','Serve over egg noodles, topped with fresh parsley.'],timesMade:0,isEasy:false},
                {id:2015,collection:'spend-with-pennies',name:'Easy Pasta Salad',prepTime:'15 min',cookTime:10,servings:8,costPerServing:1.80,macros:{calories:320,protein:11,carbs:36,fat:14,fiber:2,sugar:4,sodium:580},tags:['Lunch','Side Dish','Vegetarian','Easy'],image:'https://www.spendwithpennies.com/wp-content/uploads/2026/01/1200-Easy-Pasta-Salad-5-SpendWithPennies-1-270x405.jpg',ingredients:['12 oz rotini pasta','1 cup Italian dressing, plus more to taste','1 cup cherry tomatoes, halved','1 cup cucumber, diced','1/2 cup black olives, sliced','1/2 cup red onion, finely diced','1/2 cup green bell pepper, diced','4 oz salami or pepperoni, chopped','4 oz provolone or mozzarella, cubed','1 tsp Italian seasoning','Salt and pepper'],instructions:['Cook pasta according to package directions. Drain and rinse with cold water.','Transfer pasta to a large bowl. Toss immediately with half the Italian dressing while still warm.','Add all remaining ingredients and toss to combine.','Drizzle with remaining dressing and season with Italian seasoning, salt and pepper.','Refrigerate at least 1 hour before serving. Add a splash more dressing if it seems dry after chilling.'],timesMade:0,isEasy:true},
                {id:2016,collection:'spend-with-pennies',name:'Roasted Cauliflower',prepTime:'10 min',cookTime:25,servings:4,costPerServing:1.50,macros:{calories:110,protein:3,carbs:10,fat:7,fiber:3,sugar:3,sodium:240},tags:['Side Dish','Vegetarian','Gluten-Free','Easy'],image:'https://www.spendwithpennies.com/wp-content/uploads/2026/01/1200-Roasted-Cauliflower-2-SpendWithPennies-270x405.jpg',ingredients:['1 large head cauliflower, cut into florets','3 tbsp olive oil','1/2 tsp garlic powder','1/2 tsp onion powder','1/2 tsp smoked paprika','Salt and pepper','2 tbsp grated Parmesan (optional)','Fresh parsley for garnish'],instructions:['Preheat oven to 425°F. Line a large baking sheet with parchment.','Toss cauliflower florets with olive oil, garlic powder, onion powder, paprika, salt and pepper. Make sure everything is well coated.','Spread in a single layer — give each floret some space so they roast, not steam.','Roast 20–25 minutes, flipping halfway, until deeply golden and caramelized at the edges.','Sprinkle with Parmesan in the last 5 minutes if using.','Garnish with parsley and serve hot.'],timesMade:0,isEasy:true},
                {id:2017,collection:'spend-with-pennies',name:'Homemade Tartar Sauce',prepTime:'5 min',cookTime:0,servings:8,costPerServing:0.50,macros:{calories:95,protein:0,carbs:2,fat:10,fiber:0,sugar:1,sodium:190},tags:['Condiment','Easy','Gluten-Free'],image:'https://www.spendwithpennies.com/wp-content/uploads/2026/02/Tartar-Sauce-SpendWithPennies-6-270x405.jpg',ingredients:['1 cup mayonnaise','3 tbsp dill pickle relish or finely chopped dill pickles','1 tbsp capers, chopped (optional)','1 tbsp fresh lemon juice','1 tsp Dijon mustard','1 tbsp fresh dill or 1 tsp dried dill','Salt and pepper to taste'],instructions:['Combine all ingredients in a small bowl and stir to mix.','Taste and adjust — add more lemon for brightness, more pickle for crunch, more mustard for tang.','Season with salt and pepper.','Refrigerate at least 30 minutes before serving to let the flavors come together.','Keeps covered in the fridge for up to 2 weeks.'],timesMade:0,isEasy:true},
                {id:2018,collection:'spend-with-pennies',name:'Cavatelli and Broccoli',prepTime:'5 min',cookTime:20,servings:4,costPerServing:2.80,macros:{calories:390,protein:14,carbs:56,fat:13,fiber:5,sugar:3,sodium:430},tags:['Dinner','Vegetarian','Easy'],image:'https://www.spendwithpennies.com/wp-content/uploads/2026/01/Cavatelli-and-Broccoli-SpendWithPennies-5-270x405.jpg',ingredients:['12 oz frozen cavatelli pasta','3 cups broccoli florets','4 tbsp olive oil','4 cloves garlic, sliced thin','1/4 tsp red pepper flakes','1/2 cup reserved pasta water','1/2 cup grated Parmesan','Salt and pepper','Extra olive oil for finishing'],instructions:['Cook cavatelli in well-salted boiling water according to package directions. Add broccoli in the last 3 minutes of cooking.','Reserve 1/2 cup pasta water before draining.','Meanwhile, heat olive oil in a large skillet over medium heat. Add garlic and red pepper flakes, cook until garlic is golden and fragrant, about 2 minutes.','Add drained pasta and broccoli to the skillet. Toss with garlic oil.','Add pasta water a splash at a time until you get a light, glossy sauce.','Remove from heat, add Parmesan and toss again.','Finish with a drizzle of olive oil, salt and pepper to taste.'],timesMade:0,isEasy:true},
                {id:2019,collection:'spend-with-pennies',name:'Crockpot Beef Stew',prepTime:'20 min',cookTime:480,servings:6,costPerServing:4.50,macros:{calories:320,protein:30,carbs:24,fat:11,fiber:3,sugar:4,sodium:590},tags:['Dinner','Comfort Food'],image:'https://www.spendwithpennies.com/wp-content/uploads/2025/01/1200-Crockpot-Beef-Stew-5-SpendWithPennies-2-270x405.jpg',ingredients:['2 lb beef stew meat, cut into 1-inch chunks','3 tbsp flour','1 lb baby potatoes, halved','3 carrots, sliced into chunks','2 stalks celery, sliced','1 onion, diced','3 cloves garlic, minced','2 cups beef broth','1 can (14 oz) diced tomatoes','2 tbsp tomato paste','1 tbsp Worcestershire sauce','1 tsp thyme','1 tsp rosemary','Salt and pepper'],instructions:['Toss beef with flour, salt and pepper until lightly coated.','Add beef to the slow cooker with potatoes, carrots, celery, onion and garlic.','Whisk together broth, diced tomatoes, tomato paste, Worcestershire, thyme and rosemary. Pour over everything.','Cover and cook on low 8–10 hours or high 4–5 hours, until beef is fall-apart tender.','Taste and adjust seasoning before serving.','Serve with crusty bread for soaking up the broth.'],timesMade:0,isEasy:true},
                {id:2020,collection:'spend-with-pennies',name:'Sun Dried Tomato Pasta',prepTime:'5 min',cookTime:15,servings:4,costPerServing:3.20,macros:{calories:480,protein:14,carbs:58,fat:21,fiber:3,sugar:6,sodium:510},tags:['Dinner','Vegetarian','Easy'],image:'https://www.spendwithpennies.com/wp-content/uploads/2026/01/Sundried-Tomato-Pasta-SpendWithPennies-8-270x405.jpg',ingredients:['12 oz penne pasta','1 jar (8 oz) sun dried tomatoes in oil, drained and chopped (reserve 2 tbsp oil)','4 cloves garlic, minced','1/2 cup heavy cream','1/2 cup chicken or vegetable broth','1/2 cup grated Parmesan','1/4 tsp red pepper flakes','Fresh basil','Salt and pepper'],instructions:['Cook pasta in salted water until al dente. Reserve 1/2 cup pasta water before draining.','Heat 2 tbsp sun dried tomato oil in a large skillet over medium heat. Add garlic and red pepper flakes, cook 1 minute.','Add sun dried tomatoes and cook 2 minutes, stirring.','Pour in broth and cream. Simmer 3–4 minutes until slightly thickened.','Add pasta and toss to coat, adding pasta water as needed to loosen the sauce.','Remove from heat and stir in Parmesan.','Top with fresh basil and extra Parmesan to serve.'],timesMade:0,isEasy:true},
                // Brocc Your Body
                                                                                                                                                                                // Fit Foodie Finds
                {id:2031,collection:'fit-foodie-finds',name:'Overnight Oats',prepTime:'5 min',cookTime:0,servings:1,costPerServing:1.50,macros:{calories:310,protein:12,carbs:42,fat:8,fiber:5,sugar:12,sodium:160},tags:['Breakfast','Healthy','Easy','Meal Prep'],image:'https://fitfoodiefinds.com/wp-content/uploads/2023/12/Overnight-Oats-06-600x896.jpg',ingredients:['1/2 cup old-fashioned rolled oats','1/2 cup milk of choice','1/4 cup plain Greek yogurt','1 tbsp chia seeds','1 tbsp maple syrup or honey','1/2 tsp vanilla extract','Pinch of salt','Toppings: fresh fruit, nut butter, granola, nuts'],instructions:['Add oats, milk, yogurt, chia seeds, maple syrup, vanilla and salt to a jar or container with a lid.','Stir everything together until well combined.','Seal and refrigerate overnight, or at least 6 hours.','In the morning, give it a stir. Add a splash of milk if you prefer a thinner consistency.','Top with your choice of fresh fruit, nut butter, granola or nuts and serve cold.'],timesMade:0,isEasy:true},
                {id:2032,collection:'fit-foodie-finds',name:'Chicken and Rice',prepTime:'10 min',cookTime:45,servings:4,costPerServing:3.50,macros:{calories:430,protein:38,carbs:38,fat:12,fiber:2,sugar:3,sodium:520},tags:['Dinner','Healthy','Easy'],image:'https://fitfoodiefinds.com/wp-content/uploads/2020/12/chicken-and-rice-5-600x896.jpg',ingredients:['1.5 lb boneless skinless chicken thighs','1.5 cups long-grain white rice','3 cups chicken broth','1 small onion, diced','3 cloves garlic, minced','1 tsp garlic powder','1 tsp onion powder','1 tsp paprika','1/2 tsp dried thyme','2 tbsp olive oil','Salt and pepper','Fresh parsley for garnish'],instructions:['Preheat oven to 375°F.','Season chicken thighs on both sides with garlic powder, onion powder, paprika, thyme, salt and pepper.','Heat olive oil in a large oven-safe skillet or Dutch oven over medium-high heat. Sear chicken 3–4 minutes per side until golden. Remove and set aside.','In the same pan, sauté onion 3 minutes until softened. Add garlic and cook 1 minute more.','Add rice and stir to coat in the oil. Pour in chicken broth and bring to a simmer.','Nestle chicken thighs on top of the rice.','Cover tightly and bake 30–35 minutes until rice is cooked and chicken reaches 165°F.','Let rest 5 minutes, garnish with parsley and serve.'],timesMade:0,isEasy:true},
                {id:2033,collection:'fit-foodie-finds',name:'Beef Chili',prepTime:'15 min',cookTime:45,servings:6,costPerServing:3.20,macros:{calories:360,protein:30,carbs:28,fat:13,fiber:9,sugar:7,sodium:610},tags:['Dinner','Healthy'],image:'https://fitfoodiefinds.com/wp-content/uploads/2019/09/CHILI-f2-600x896.jpg',ingredients:['1.5 lb lean ground beef','1 can (28 oz) crushed tomatoes','1 can (15 oz) diced tomatoes','2 cans (15 oz each) kidney or black beans, drained','1 small onion, diced','1 green bell pepper, diced','3 cloves garlic, minced','2 tbsp chili powder','1 tsp cumin','1 tsp smoked paprika','1/2 tsp oregano','Salt and pepper','Toppings: shredded cheese, sour cream, green onion, cilantro'],instructions:['Heat a large pot or Dutch oven over medium-high heat. Brown ground beef, breaking it apart. Drain excess fat.','Add onion and bell pepper, cook 4–5 minutes until softened. Add garlic and cook 1 minute.','Stir in chili powder, cumin, paprika and oregano. Cook 1 minute until fragrant.','Add crushed tomatoes, diced tomatoes and beans. Stir to combine.','Bring to a boil, then reduce heat and simmer uncovered 30–35 minutes, stirring occasionally, until thickened.','Season with salt and pepper.','Serve with your favorite toppings.'],timesMade:0,isEasy:true},
                {id:2034,collection:'fit-foodie-finds',name:'Mexican Ground Beef Skillet',prepTime:'10 min',cookTime:20,servings:4,costPerServing:3.80,macros:{calories:380,protein:32,carbs:24,fat:16,fiber:6,sugar:4,sodium:590},tags:['Dinner','Healthy','Easy'],image:'https://fitfoodiefinds.com/wp-content/uploads/2020/01/skillet2f2-600x896.jpg',ingredients:['1 lb lean ground beef','1 can (15 oz) black beans, drained','1 can (15 oz) corn, drained','1 can (10 oz) diced tomatoes with green chiles','1 small onion, diced','3 cloves garlic, minced','1 tsp cumin','1 tsp chili powder','1/2 tsp smoked paprika','Salt and pepper','1 cup shredded Mexican blend cheese','Fresh cilantro, lime, sliced avocado for serving'],instructions:['Brown ground beef in a large skillet over medium-high heat, breaking it up as it cooks. Drain fat.','Add onion and cook 3 minutes until softened. Add garlic and spices, cook 1 minute more.','Stir in beans, corn and diced tomatoes with chiles. Simmer 5–7 minutes until heated through and any extra liquid has cooked off.','Season with salt and pepper.','Sprinkle cheese over the top, cover for 1–2 minutes until melted.','Serve straight from the skillet topped with cilantro, avocado and a squeeze of lime.'],timesMade:0,isEasy:true},
                {id:2035,collection:'fit-foodie-finds',name:'Air Fryer Coconut Chicken Tenders',prepTime:'15 min',cookTime:12,servings:4,costPerServing:4.50,macros:{calories:340,protein:34,carbs:20,fat:13,fiber:3,sugar:4,sodium:420},tags:['Dinner','Healthy','Easy'],image:'https://fitfoodiefinds.com/wp-content/uploads/2022/03/Air-Fryer-Coconut-Chicken-1-600x896.jpg',ingredients:['1.5 lb chicken tenders or breasts cut into strips','1/2 cup all-purpose flour or coconut flour','2 eggs, beaten','1 cup shredded unsweetened coconut','1/2 cup panko breadcrumbs','1/2 tsp garlic powder','1/2 tsp salt','1/4 tsp pepper','Dipping sauce: sweet chili sauce or mango salsa'],instructions:['Set up a breading station: flour in one bowl, beaten eggs in a second, and a mix of shredded coconut, panko, garlic powder, salt and pepper in a third.','Pat chicken dry. Coat each piece in flour, shaking off excess. Dip in egg, then press firmly into the coconut-panko mixture.','Preheat air fryer to 400°F. Lightly spray the basket with cooking spray.','Place tenders in a single layer — work in batches if needed.','Air fry 10–12 minutes, flipping halfway, until golden and cooked through.','Serve immediately with sweet chili sauce or mango salsa for dipping.'],timesMade:0,isEasy:true},
                {id:2036,collection:'fit-foodie-finds',name:'Hot Honey Chicken Salad',prepTime:'15 min',cookTime:20,servings:4,costPerServing:5.00,macros:{calories:350,protein:40,carbs:14,fat:15,fiber:3,sugar:9,sodium:480},tags:['Lunch','Healthy'],image:'https://fitfoodiefinds.com/wp-content/uploads/2024/03/Hot-Honey-Chicken-Salad-03-600x896.jpg',ingredients:['1.5 lb chicken breast','3 tbsp hot honey (or honey + pinch of cayenne)','1 tbsp olive oil','1 tsp garlic powder','Salt and pepper','6 cups mixed greens or romaine','1/2 cup cherry tomatoes, halved','1/2 cup cucumber, sliced','1/4 cup red onion, thinly sliced','1/2 cup crumbled feta or blue cheese','Dressing: 3 tbsp olive oil, 2 tbsp apple cider vinegar, 1 tsp honey, salt and pepper'],instructions:['Season chicken with garlic powder, salt and pepper.','Heat olive oil in a skillet over medium-high. Cook chicken 6–7 minutes per side until cooked through. Let rest 5 minutes, then slice.','Drizzle hot honey over the sliced warm chicken.','Whisk together dressing ingredients.','Assemble salad with greens, tomatoes, cucumber and red onion.','Top with hot honey chicken and crumbled cheese.','Drizzle dressing over and serve immediately.'],timesMade:0,isEasy:true},
                {id:2037,collection:'fit-foodie-finds',name:'Firecracker Shrimp',prepTime:'10 min',cookTime:10,servings:4,costPerServing:5.50,macros:{calories:280,protein:32,carbs:18,fat:8,fiber:1,sugar:12,sodium:740},tags:['Dinner','Healthy','Easy'],image:'https://fitfoodiefinds.com/wp-content/uploads/2023/01/Firecracker-Shrimp-01-600x896.jpg',ingredients:['1.5 lb large shrimp, peeled and deveined','2 tbsp olive oil','3 cloves garlic, minced','1/4 cup sweet chili sauce','2 tbsp sriracha','1 tbsp soy sauce','1 tbsp honey','1 tsp rice vinegar','Sesame seeds and green onion for garnish','Rice or lettuce cups for serving'],instructions:['Pat shrimp dry and season with salt and pepper.','Whisk together sweet chili sauce, sriracha, soy sauce, honey and rice vinegar in a small bowl. Set aside.','Heat olive oil in a large skillet over high heat. Add shrimp in a single layer and cook 1–2 minutes per side until pink. Remove and set aside.','Add garlic to the same pan, cook 30 seconds. Pour in sauce and let it bubble 1 minute.','Return shrimp to pan and toss to coat.','Serve over rice or in lettuce cups, garnished with sesame seeds and green onion.'],timesMade:0,isEasy:true},
                {id:2038,collection:'fit-foodie-finds',name:'Air Fryer Sweet Potato Chips',prepTime:'10 min',cookTime:15,servings:2,costPerServing:1.80,macros:{calories:130,protein:2,carbs:24,fat:4,fiber:3,sugar:5,sodium:220},tags:['Snack','Healthy','Easy','Vegan'],image:'https://fitfoodiefinds.com/wp-content/uploads/2023/08/Air-Fryer-Sweet-Potato-Chips-2-600x896.jpg',ingredients:['2 medium sweet potatoes, peeled','1 tbsp olive oil','1/2 tsp garlic powder','1/2 tsp paprika','1/4 tsp cayenne (optional)','Salt to taste'],instructions:['Slice sweet potatoes as thin and even as possible — about 1/16 inch. A mandoline works great if you have one.','Toss slices with olive oil, garlic powder, paprika, cayenne and salt.','Preheat air fryer to 375°F.','Work in batches — spread chips in a single layer with no overlapping.','Air fry 12–15 minutes, shaking the basket every 4–5 minutes, until crispy and golden. Keep a close eye in the last few minutes; they go from perfect to burnt quickly.','Let cool 2–3 minutes — they continue to crisp as they cool.'],timesMade:0,isEasy:true},
                {id:2039,collection:'fit-foodie-finds',name:'Chocolate Protein Mousse',prepTime:'10 min',cookTime:0,servings:2,costPerServing:2.50,macros:{calories:220,protein:28,carbs:18,fat:4,fiber:2,sugar:12,sodium:180},tags:['Snack','Healthy','Easy'],image:'https://fitfoodiefinds.com/wp-content/uploads/2023/09/High-Protein-Mousse-3-600x896.jpg',ingredients:['1 cup plain or vanilla Greek yogurt (full fat preferred)','2 scoops chocolate protein powder','2 tbsp unsweetened cocoa powder','2–3 tbsp milk of choice','1–2 tbsp honey or maple syrup','1/2 tsp vanilla extract','Pinch of salt','Toppings: berries, dark chocolate chips, whipped cream'],instructions:['Add Greek yogurt, protein powder, cocoa powder, milk, honey, vanilla and salt to a bowl.','Beat with a hand mixer or whisk vigorously until completely smooth and fluffy, 1–2 minutes. Add more milk a tablespoon at a time if the mixture is too thick.','Taste and adjust sweetness.','Divide into two glasses or bowls.','Refrigerate 30 minutes for a firmer texture, or eat right away.','Top with berries, dark chocolate chips or a dollop of whipped cream.'],timesMade:0,isEasy:true},
                {id:2040,collection:'fit-foodie-finds',name:'Butter Chicken Meatballs',prepTime:'15 min',cookTime:30,servings:4,costPerServing:5.00,macros:{calories:420,protein:30,carbs:24,fat:22,fiber:3,sugar:8,sodium:580},tags:['Dinner','Healthy'],image:'https://fitfoodiefinds.com/wp-content/uploads/2026/02/butter-chicken-meatballs-8-600x896.jpg',ingredients:['1 lb ground chicken','1/4 cup breadcrumbs','1 egg','2 cloves garlic, minced','1 tsp garam masala','1/2 tsp cumin','1/2 tsp salt','Butter Chicken Sauce: 2 tbsp butter, 1 small onion diced, 3 cloves garlic, 1 tbsp grated ginger, 1 tbsp garam masala, 1 tsp cumin, 1 can (15 oz) tomato sauce, 1/2 cup heavy cream or coconut cream, salt to taste','Basmati rice and naan for serving','Fresh cilantro'],instructions:['Make the meatballs: combine ground chicken, breadcrumbs, egg, garlic, garam masala, cumin and salt. Mix gently and roll into 1.5-inch balls.','Heat a drizzle of oil in a large skillet over medium-high heat. Brown meatballs on all sides, 4–5 minutes total. They don\'t need to be cooked through. Set aside.','In the same pan, melt butter over medium heat. Cook onion until soft, 4–5 minutes. Add garlic, ginger and spices, cook 1 minute until fragrant.','Pour in tomato sauce, stir to combine. Simmer 10 minutes.','Stir in cream and return meatballs to the pan. Simmer 10 more minutes until meatballs are cooked through and sauce is rich.','Serve over basmati rice with naan and fresh cilantro.'],timesMade:0,isEasy:false},
                // Downshiftology
                {id:2041,collection:'downshiftology',name:'Red Beans and Rice',prepTime:'15 min',cookTime:60,servings:6,costPerServing:2.2,macros:{calories:380,protein:18,carbs:62,fat:6,fiber:12,sugar:4,sodium:580},tags:['Dinner','Gluten-Free','Easy'],image:'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2026/02/Red-Beans-and-Rice-main-600x600.jpg',ingredients:['1 lb dried red kidney beans, soaked overnight','1 lb andouille sausage, sliced','1 onion, diced','3 stalks celery, diced','1 green bell pepper, diced','4 cloves garlic, minced','2 bay leaves','1 tsp dried thyme','1 tsp smoked paprika','1/2 tsp cayenne pepper','4 cups chicken broth','Salt and pepper','Cooked white rice and green onions to serve'],instructions:['Sauté sausage in a large pot over medium-high heat until browned. Remove and set aside.','In the same pot, cook onion, celery and bell pepper until softened, about 5 minutes. Add garlic and cook 1 minute more.','Add drained beans, broth, bay leaves, thyme, paprika and cayenne. Bring to a boil.','Reduce heat, cover and simmer 45–50 minutes until beans are completely tender.','Remove about 1 cup of beans and mash them, then stir back into the pot to thicken the mixture.','Return sausage to the pot and season with salt and pepper.','Remove bay leaves. Serve over white rice with green onions.'],timesMade:0,isEasy:true},
                {id:2042,collection:'downshiftology',name:'Garlic Herb Baked Cod',prepTime:'10 min',cookTime:15,servings:4,costPerServing:6.5,macros:{calories:220,protein:34,carbs:4,fat:8,fiber:1,sugar:1,sodium:380},tags:['Dinner','Healthy','Gluten-Free','Easy'],image:'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2023/10/Baked-Cod-main-600x600.jpg',ingredients:['4 cod fillets (6 oz each)','3 tbsp olive oil','4 cloves garlic, minced','2 tbsp fresh parsley, chopped','1 tbsp fresh lemon juice','1 tsp lemon zest','1/2 tsp dried oregano','Salt and pepper','Lemon slices to serve'],instructions:['Preheat oven to 400°F. Line a baking dish with parchment.','Pat cod fillets dry and place in the baking dish.','Mix together olive oil, garlic, parsley, lemon juice, zest and oregano.','Spoon the garlic herb mixture over the top of each fillet.','Season with salt and pepper.','Bake 12–15 minutes until fish flakes easily with a fork.','Serve immediately with lemon slices.'],timesMade:0,isEasy:true},
                {id:2043,collection:'downshiftology',name:'Irish Lamb Stew',prepTime:'20 min',cookTime:90,servings:6,costPerServing:7.5,macros:{calories:420,protein:34,carbs:28,fat:18,fiber:4,sugar:5,sodium:520},tags:['Dinner','Gluten-Free'],image:'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2020/03/Irish-Lamb-Stew-main-600x600.jpg',ingredients:['2 lb lamb shoulder, cut into 1.5-inch pieces','1 lb baby potatoes, halved','3 carrots, sliced','2 parsnips, diced','1 onion, diced','3 cloves garlic, minced','2 cups beef or lamb broth','1 cup Guinness stout (optional)','2 tbsp tomato paste','1 tsp fresh thyme','1 tsp fresh rosemary','2 tbsp olive oil','Salt and pepper','Fresh parsley to serve'],instructions:['Season lamb pieces generously with salt and pepper.','Heat olive oil in a large Dutch oven over high heat. Brown lamb in batches, 2–3 minutes per side. Set aside.','In the same pot, cook onion over medium heat until softened, 4 minutes. Add garlic and cook 1 minute.','Stir in tomato paste. Pour in broth and Guinness, scraping up any browned bits.','Return lamb to the pot with thyme and rosemary. Bring to a boil.','Reduce heat, cover and simmer 45 minutes.','Add potatoes, carrots and parsnips. Continue simmering 30–35 minutes until lamb is tender and vegetables are cooked through.','Season to taste and serve with fresh parsley.'],timesMade:0,isEasy:false},
                {id:2044,collection:'downshiftology',name:'Pan Seared Scallops with Lemon Garlic Butter',prepTime:'5 min',cookTime:10,servings:4,costPerServing:12.0,macros:{calories:240,protein:22,carbs:6,fat:14,fiber:0,sugar:1,sodium:540},tags:['Dinner','Gluten-Free','Easy'],image:'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2026/01/Pan-Seared-Scallops-main-2-600x600.jpg',ingredients:['1.5 lb large sea scallops, patted very dry','3 tbsp butter, divided','2 tbsp olive oil','4 cloves garlic, minced','2 tbsp fresh lemon juice','2 tbsp fresh parsley, chopped','Salt and pepper'],instructions:['Pat scallops extremely dry with paper towels — this is critical for a good sear. Season generously with salt and pepper.','Heat olive oil and 1 tbsp butter in a large stainless or cast iron skillet over high heat until just smoking.','Add scallops in a single layer, making sure not to crowd them. Sear undisturbed for 1.5–2 minutes until a golden crust forms.','Flip and sear the other side 1–1.5 minutes. Transfer to a plate.','Reduce heat to medium. Add remaining butter and garlic to the pan, cook 30 seconds.','Add lemon juice and swirl to combine into a sauce.','Pour the lemon garlic butter over the scallops and garnish with parsley. Serve immediately.'],timesMade:0,isEasy:true},
                {id:2045,collection:'downshiftology',name:'Chocolate Covered Strawberries',prepTime:'15 min',cookTime:5,servings:6,costPerServing:2.5,macros:{calories:160,protein:2,carbs:22,fat:8,fiber:2,sugar:18,sodium:10},tags:['Dessert','Easy','Gluten-Free'],image:'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2020/02/Chocolate-Covered-Strawberries-main-600x600.jpg',ingredients:['1 lb fresh strawberries, washed and dried completely','8 oz dark or semi-sweet chocolate chips','1 tsp coconut oil','Optional toppings: crushed nuts, sprinkles, white chocolate drizzle'],instructions:['Line a baking sheet with parchment paper.','Make sure strawberries are completely dry — any water will cause the chocolate to seize.','Combine chocolate chips and coconut oil in a microwave-safe bowl. Microwave in 30-second intervals, stirring each time, until fully melted and smooth.','Holding each strawberry by the stem, dip into the chocolate and let the excess drip off.','Place on the parchment-lined sheet. Add any toppings while the chocolate is still wet.','Refrigerate 15–20 minutes until chocolate is fully set.','Best eaten the same day.'],timesMade:0,isEasy:true},
                {id:2046,collection:'downshiftology',name:'Buffalo Cauliflower',prepTime:'10 min',cookTime:30,servings:4,costPerServing:2.8,macros:{calories:160,protein:4,carbs:16,fat:9,fiber:4,sugar:4,sodium:680},tags:['Side Dish','Vegetarian','Gluten-Free','Easy'],image:'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2026/01/Buffalo-Cauliflower-main-600x600.jpg',ingredients:['1 large head cauliflower, cut into florets','3 tbsp olive oil','1/2 tsp garlic powder','Salt and pepper','1/2 cup buffalo hot sauce','2 tbsp butter or ghee, melted','Ranch or blue cheese dressing and celery sticks to serve'],instructions:['Preheat oven to 425°F. Line a large baking sheet with parchment.','Toss cauliflower florets with olive oil, garlic powder, salt and pepper.','Spread in a single layer on the baking sheet — do not crowd. Roast 20 minutes.','While cauliflower roasts, whisk together buffalo sauce and melted butter.','Remove cauliflower from oven, toss with buffalo sauce mixture, then return to oven.','Roast another 8–10 minutes until edges are caramelized and sticky.','Serve with ranch or blue cheese dressing and celery sticks.'],timesMade:0,isEasy:true},
                {id:2047,collection:'downshiftology',name:'Cabbage Roll Soup',prepTime:'15 min',cookTime:40,servings:8,costPerServing:2.4,macros:{calories:290,protein:22,carbs:24,fat:10,fiber:4,sugar:7,sodium:640},tags:['Dinner','Soup','Gluten-Free','Easy'],image:'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2026/01/Cabbage-Roll-Soup-main-600x600.jpg',ingredients:['1 lb ground beef','1/2 small head green cabbage, chopped','1 onion, diced','3 cloves garlic, minced','1 can (28 oz) crushed tomatoes','1 can (14 oz) diced tomatoes','4 cups beef broth','3/4 cup white rice, uncooked','2 tsp Italian seasoning','1 tsp smoked paprika','Salt and pepper','Fresh parsley to garnish'],instructions:['Brown ground beef in a large pot over medium-high heat. Drain excess fat.','Add onion and cook 4 minutes until softened. Add garlic and cook 1 minute.','Stir in Italian seasoning and paprika.','Pour in crushed tomatoes, diced tomatoes and broth. Stir to combine.','Bring to a boil, then add cabbage and rice.','Reduce heat, cover and simmer 25–30 minutes until rice is cooked and cabbage is tender.','Season with salt and pepper. Serve topped with fresh parsley.'],timesMade:0,isEasy:true},
                {id:2048,collection:'downshiftology',name:'Healthy Spinach Artichoke Dip',prepTime:'10 min',cookTime:25,servings:8,costPerServing:2.0,macros:{calories:140,protein:8,carbs:6,fat:10,fiber:2,sugar:2,sodium:310},tags:['Appetizer','Vegetarian','Gluten-Free','Easy'],image:'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2020/01/Healthy-Spinach-Artichoke-Dip-main-600x600.jpg',ingredients:['10 oz frozen spinach, thawed and squeezed dry','1 can (14 oz) artichoke hearts, drained and chopped','8 oz cream cheese, softened','1/2 cup plain Greek yogurt','1/2 cup sour cream','1/2 cup Parmesan, grated','1 cup mozzarella, shredded and divided','3 cloves garlic, minced','Salt and pepper','Chips, crackers or veggie sticks to serve'],instructions:['Preheat oven to 375°F.','Combine cream cheese, Greek yogurt, sour cream, Parmesan, half the mozzarella and garlic in a bowl. Mix until smooth.','Stir in spinach and artichoke hearts. Season with salt and pepper.','Transfer to a baking dish. Top with remaining mozzarella.','Bake 20–25 minutes until bubbly and golden on top.','Serve hot with chips, crackers or veggies.'],timesMade:0,isEasy:true},
                {id:2049,collection:'downshiftology',name:'Tzatziki',prepTime:'15 min',cookTime:0,servings:8,costPerServing:1.2,macros:{calories:60,protein:4,carbs:4,fat:3,fiber:0,sugar:3,sodium:120},tags:['Appetizer','Vegetarian','Gluten-Free','Easy'],image:'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2023/08/Tzatziki-main-600x600.jpg',ingredients:['2 cups plain full-fat Greek yogurt','1 English cucumber, grated','3 cloves garlic, minced','2 tbsp fresh dill, chopped','2 tbsp fresh lemon juice','1 tbsp olive oil','1/2 tsp salt'],instructions:['Grate the cucumber, then squeeze out as much liquid as possible using your hands or a clean kitchen towel. This step is essential — excess moisture makes tzatziki watery.','In a bowl, combine Greek yogurt, squeezed cucumber, garlic, dill, lemon juice, olive oil and salt.','Stir everything together until well combined.','Taste and adjust seasoning as needed.','Refrigerate at least 30 minutes before serving to let flavors meld.','Drizzle with a little extra olive oil before serving with pita or vegetables.'],timesMade:0,isEasy:true},
                {id:2050,collection:'downshiftology',name:'Potato Skins',prepTime:'15 min',cookTime:75,servings:4,costPerServing:2.8,macros:{calories:280,protein:12,carbs:30,fat:13,fiber:2,sugar:2,sodium:420},tags:['Appetizer','Easy','Gluten-Free'],image:'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2026/01/Potato-Skins-main-2-600x600.jpg',ingredients:['4 medium russet potatoes','2 tbsp olive oil','1/2 tsp garlic powder','1/2 tsp smoked paprika','Salt and pepper','1 cup shredded cheddar cheese','4 slices bacon, cooked and crumbled','Sour cream, chives and green onions to serve'],instructions:['Preheat oven to 400°F. Scrub potatoes, dry them, and pierce all over with a fork.','Rub potatoes with a little olive oil and bake directly on the oven rack for 50–60 minutes until cooked through. Let cool enough to handle.','Cut potatoes in half lengthwise. Scoop out the flesh, leaving about 1/4 inch of potato in the skin.','Mix remaining olive oil with garlic powder, paprika, salt and pepper. Brush all over the inside and outside of the skins.','Place cut-side up on a baking sheet. Bake 10 minutes, flip, bake another 5 minutes until crispy.','Fill each skin with cheddar and bacon. Bake 5 more minutes until cheese is melted.','Top with sour cream, chives and green onions and serve immediately.'],timesMade:0,isEasy:true},
                // Skinnytaste
                {id:2051,collection:'skinnytaste',name:'Salsa Verde Chicken Tostadas',prepTime:'10 min',cookTime:25,servings:4,costPerServing:3.8,macros:{calories:340,protein:30,carbs:28,fat:12,fiber:4,sugar:3,sodium:620},tags:['Dinner','Easy','Gluten-Free'],image:'https://www.skinnytaste.com/wp-content/uploads/2013/05/Salsa-Verde-Chicken-Tostadas-13-260x390.jpg',ingredients:['1.5 lb chicken breast','1 jar (16 oz) salsa verde','8 tostada shells','1 cup refried beans or black beans','1 cup shredded Mexican cheese','1 avocado, sliced','1/2 cup cherry tomatoes, halved','1/4 cup sour cream or Greek yogurt','Fresh cilantro and lime to serve'],instructions:['Place chicken and salsa verde in a pot over medium heat. Bring to a simmer, cover and cook 20–22 minutes until chicken is cooked through.','Shred chicken using two forks and stir back into the salsa verde.','Warm tostada shells per package directions.','Spread beans on each tostada, then top with shredded chicken.','Add cheese, avocado, tomatoes and a dollop of sour cream.','Finish with cilantro and a squeeze of lime.'],timesMade:0,isEasy:true},
                {id:2052,collection:'skinnytaste',name:'Buttermilk Ranch Dressing',prepTime:'10 min',cookTime:0,servings:12,costPerServing:0.4,macros:{calories:55,protein:1,carbs:2,fat:5,fiber:0,sugar:1,sodium:130},tags:['Condiment','Vegetarian','Gluten-Free','Easy'],image:'https://www.skinnytaste.com/wp-content/uploads/2026/02/Ranch-Dressing-13-260x390.jpg',ingredients:['1/2 cup buttermilk','1/3 cup light mayonnaise','1/3 cup plain Greek yogurt','1 clove garlic, minced','1 tbsp fresh chives, chopped','1 tbsp fresh parsley, chopped','1 tbsp fresh dill, chopped','1 tsp onion powder','1/2 tsp white wine vinegar','Salt and pepper'],instructions:['Combine mayonnaise and Greek yogurt in a bowl and whisk until smooth.','Whisk in buttermilk gradually until you reach the desired consistency.','Stir in garlic, chives, parsley, dill, onion powder and vinegar.','Season generously with salt and pepper.','Taste and adjust — add more buttermilk to thin, more herbs for flavor.','Refrigerate at least 30 minutes before serving. Keeps up to 1 week.'],timesMade:0,isEasy:true},
                {id:2053,collection:'skinnytaste',name:'Chicken Lentil Soup',prepTime:'10 min',cookTime:40,servings:6,costPerServing:2.2,macros:{calories:310,protein:32,carbs:28,fat:6,fiber:8,sugar:5,sodium:560},tags:['Dinner','Soup','Gluten-Free','Easy'],image:'https://www.skinnytaste.com/wp-content/uploads/2013/12/Chicken-Lentil-Soup-17-260x390.jpg',ingredients:['1.5 lb chicken breast, diced','1 cup green or brown lentils, rinsed','1 onion, diced','3 carrots, diced','3 stalks celery, diced','4 cloves garlic, minced','1 can (14 oz) diced tomatoes','5 cups chicken broth','1 tsp cumin','1 tsp turmeric','1 tsp smoked paprika','2 tbsp olive oil','Salt and pepper','Fresh parsley and lemon to serve'],instructions:['Heat olive oil in a large pot over medium heat. Add onion, carrot and celery, cook 5 minutes until softened.','Add garlic, cumin, turmeric and paprika. Cook 1 minute until fragrant.','Add chicken, lentils, diced tomatoes and broth. Stir to combine.','Bring to a boil, then reduce heat and simmer 30–35 minutes until lentils are tender and chicken is cooked through.','Use the back of a spoon to mash some of the lentils to thicken the soup.','Season with salt and pepper.','Serve with fresh parsley and a squeeze of lemon.'],timesMade:0,isEasy:true},
                {id:2054,collection:'skinnytaste',name:'Sheet Pan Mediterranean Salmon',prepTime:'10 min',cookTime:20,servings:4,costPerServing:8.5,macros:{calories:390,protein:38,carbs:14,fat:20,fiber:4,sugar:5,sodium:480},tags:['Dinner','Healthy','Gluten-Free','Easy'],image:'https://www.skinnytaste.com/wp-content/uploads/2026/02/Sheet-Pan-Mediterranean-Salmon-11-260x390.jpg',ingredients:['4 salmon fillets (6 oz each)','1 pint cherry tomatoes','1 cup Kalamata olives, pitted','1 zucchini, sliced into half-moons','1/2 red onion, sliced','4 cloves garlic, minced','3 tbsp olive oil','1 tsp dried oregano','1 lemon, sliced','Salt and pepper','Fresh basil and feta to serve'],instructions:['Preheat oven to 400°F. Line a large baking sheet with parchment.','Toss tomatoes, olives, zucchini, onion and garlic with 2 tbsp olive oil, oregano, salt and pepper. Spread on the baking sheet.','Roast vegetables 10 minutes.','Push vegetables to the sides. Place salmon fillets in the center. Brush with remaining olive oil and season with salt and pepper.','Top with lemon slices. Roast 12–15 minutes until salmon flakes easily.','Serve topped with fresh basil and crumbled feta.'],timesMade:0,isEasy:true},
                {id:2055,collection:'skinnytaste',name:'Easy Macaroni Casserole',prepTime:'15 min',cookTime:35,servings:8,costPerServing:2.6,macros:{calories:380,protein:24,carbs:40,fat:13,fiber:2,sugar:5,sodium:520},tags:['Dinner','Easy'],image:'https://www.skinnytaste.com/wp-content/uploads/2014/01/Macaroni-Casserole-19-260x390.jpg',ingredients:['12 oz elbow macaroni, cooked','1 lb lean ground beef','1 onion, diced','3 cloves garlic, minced','1 can (28 oz) crushed tomatoes','1 tsp Italian seasoning','1 tsp smoked paprika','1.5 cups shredded mozzarella, divided','1/2 cup Parmesan, grated','Salt and pepper'],instructions:['Preheat oven to 375°F. Grease a 9x13 baking dish.','Brown ground beef in a large skillet over medium-high. Drain fat. Add onion and cook until softened. Add garlic and cook 1 minute.','Stir in crushed tomatoes, Italian seasoning and paprika. Simmer 5 minutes. Season with salt and pepper.','Combine cooked macaroni with the meat sauce. Stir in half the mozzarella.','Transfer to the baking dish. Top with remaining mozzarella and Parmesan.','Bake 20–25 minutes until bubbly and cheese is golden. Let rest 5 minutes before serving.'],timesMade:0,isEasy:true},
                {id:2056,collection:'skinnytaste',name:'Slow Cooker Beef Stroganoff',prepTime:'15 min',cookTime:360,servings:6,costPerServing:5.5,macros:{calories:420,protein:36,carbs:32,fat:16,fiber:2,sugar:4,sodium:540},tags:['Dinner','Easy'],image:'https://www.skinnytaste.com/wp-content/uploads/2026/02/Slow-Cooker-Beef-Stroganoff-17-260x390.jpg',ingredients:['2 lb beef stew meat or chuck, cut into 1-inch pieces','8 oz mushrooms, sliced','1 onion, diced','3 cloves garlic, minced','2 cups beef broth','1 tbsp Worcestershire sauce','1 tsp Dijon mustard','2 tbsp cornstarch mixed with 2 tbsp cold water','1 cup light sour cream','12 oz egg noodles, cooked','Salt, pepper, fresh parsley'],instructions:['Season beef with salt and pepper. Place in slow cooker with mushrooms, onion and garlic.','Whisk together broth, Worcestershire and mustard. Pour over beef.','Cook on low 7–8 hours or high 4–5 hours until beef is tender.','In the last 30 minutes, stir in the cornstarch slurry. Replace lid and cook until thickened.','Just before serving, stir in sour cream on low heat — do not boil.','Serve over egg noodles, garnished with fresh parsley.'],timesMade:0,isEasy:true},
                {id:2057,collection:'skinnytaste',name:'Beans and Greens',prepTime:'5 min',cookTime:15,servings:4,costPerServing:2.0,macros:{calories:260,protein:13,carbs:34,fat:8,fiber:10,sugar:3,sodium:420},tags:['Dinner','Vegetarian','Gluten-Free','Easy'],image:'https://www.skinnytaste.com/wp-content/uploads/2026/02/Beans-and-Greens-9-260x390.jpg',ingredients:['2 cans (15 oz each) cannellini beans, drained and rinsed','3 cups kale, stems removed and chopped','2 cups baby spinach','4 cloves garlic, minced','1/4 tsp red pepper flakes','3 tbsp olive oil','1/2 cup chicken or vegetable broth','Juice of 1 lemon','Salt and pepper','Parmesan and crusty bread to serve'],instructions:['Heat olive oil in a large skillet over medium heat. Add garlic and red pepper flakes, cook 1 minute until fragrant.','Add kale and broth. Stir, cover and cook 4–5 minutes until kale is wilted and tender.','Add cannellini beans and spinach. Stir until spinach wilts and beans are heated through, 2–3 minutes.','Squeeze lemon juice over everything. Season with salt and pepper.','Serve topped with Parmesan and alongside crusty bread for soaking up the broth.'],timesMade:0,isEasy:true},
                {id:2058,collection:'skinnytaste',name:'Beef Bourguignon',prepTime:'20 min',cookTime:480,servings:6,costPerServing:7.0,macros:{calories:440,protein:38,carbs:18,fat:20,fiber:3,sugar:5,sodium:560},tags:['Dinner','Gluten-Free'],image:'https://www.skinnytaste.com/wp-content/uploads/2024/12/Slow-Cooker-Beef-Bourguignon-02-260x390.jpg',ingredients:['2 lb beef chuck, cut into 2-inch pieces','6 strips bacon, chopped','1 lb cremini mushrooms, quartered','2 cups pearl onions (frozen is fine)','3 cloves garlic, minced','2 cups dry red wine (Burgundy or Pinot Noir)','1 cup beef broth','2 tbsp tomato paste','2 tsp fresh thyme','2 bay leaves','Salt and pepper','Fresh parsley to serve'],instructions:['Cook bacon in a skillet until crispy. Remove and add to slow cooker.','Season beef with salt and pepper. Brown in bacon fat in batches. Transfer to slow cooker.','Add mushrooms, pearl onions and garlic to the slow cooker.','Whisk together wine, broth and tomato paste. Pour over everything. Add thyme and bay leaves.','Cook on low 8 hours or high 4–5 hours until beef is very tender.','Remove bay leaves. Taste and adjust seasoning.','Serve over mashed potatoes or egg noodles, topped with fresh parsley.'],timesMade:0,isEasy:false},
                {id:2059,collection:'skinnytaste',name:'Quick Beef Chili',prepTime:'10 min',cookTime:30,servings:6,costPerServing:3.2,macros:{calories:350,protein:28,carbs:26,fat:14,fiber:8,sugar:5,sodium:600},tags:['Dinner','Soup','Gluten-Free','Easy'],image:'https://www.skinnytaste.com/wp-content/uploads/2026/02/Quick-Beef-Chili-15-260x390.jpg',ingredients:['1.5 lb lean ground beef (90/10)','1 onion, diced','4 cloves garlic, minced','1 green bell pepper, diced','2 cans (15 oz each) kidney beans, drained','1 can (28 oz) crushed tomatoes','1 cup beef broth','2 tbsp chili powder','1 tsp cumin','1 tsp smoked paprika','1/2 tsp oregano','Salt and pepper','Toppings: sour cream, cheddar, green onions'],instructions:['Brown ground beef in a large pot over medium-high heat. Drain fat.','Add onion and bell pepper, cook 3–4 minutes until softened. Add garlic and spices, cook 1 minute.','Pour in crushed tomatoes, beans and broth. Stir to combine.','Bring to a boil, then reduce heat and simmer uncovered 20–25 minutes until slightly thickened.','Season with salt and pepper. Serve with your favorite toppings.'],timesMade:0,isEasy:true},
                {id:2060,collection:'skinnytaste',name:'Slow Cooker Birria Tacos',prepTime:'20 min',cookTime:480,servings:8,costPerServing:4.5,macros:{calories:380,protein:34,carbs:24,fat:16,fiber:2,sugar:4,sodium:580},tags:['Dinner','Gluten-Free'],image:'https://www.skinnytaste.com/wp-content/uploads/2021/03/Birria-Tacos-19-260x390.jpg',ingredients:['3 lb beef chuck roast, cut into chunks','3 dried guajillo chiles, seeded','2 dried ancho chiles, seeded','1 onion, quartered','4 cloves garlic','1 can (14 oz) diced tomatoes','2 cups beef broth','1 tsp cumin','1 tsp dried oregano','1/2 tsp cinnamon','Corn tortillas','Oaxaca or mozzarella cheese, shredded','White onion, cilantro and lime to serve'],instructions:['Toast dried chiles in a dry skillet over medium heat, 30 seconds per side. Soak in hot water 20 minutes. Drain.','Blend softened chiles, onion, garlic, diced tomatoes, broth, cumin, oregano and cinnamon until smooth.','Season beef with salt and pepper. Place in slow cooker. Pour the chile sauce over top.','Cook on low 8–9 hours until beef is fall-apart tender.','Remove beef and shred. Reserve the consomé (cooking liquid) for dipping.','Dip tortillas in the consomé, place in a hot skillet. Add beef and cheese, fold and cook until crispy on both sides.','Serve with diced onion, cilantro and lime, with consomé on the side for dipping.'],timesMade:0,isEasy:false},
                // The Modern Proper
                {id:2091,collection:'the-modern-proper',name:'Tikka Masala Soup',prepTime:'10 min',cookTime:35,servings:6,costPerServing:3.8,macros:{calories:340,protein:28,carbs:22,fat:14,fiber:4,sugar:8,sodium:580},tags:['Dinner','Soup','Gluten-Free','Easy'],image:'https://images.themodernproper.com/production/posts/2019/Tikka-Masala-Soup-8_191019_231153.jpg?w=800&q=82&auto=format&fit=crop&dm=1771345301&s=4f62523a6ec10ce50e4bc7844fd9370d',ingredients:['1.5 lb chicken breast, diced','1 can (14 oz) diced tomatoes','1 can (14 oz) coconut milk','1 cup chicken broth','1 onion, diced','4 cloves garlic, minced','1 tbsp fresh ginger, grated','2 tbsp tikka masala paste or curry powder blend','1 tsp garam masala','1 tsp cumin','2 tbsp olive oil','Salt and pepper','Fresh cilantro, Greek yogurt and naan to serve'],instructions:['Heat olive oil in a large pot over medium heat. Cook onion until softened, 5 minutes.','Add garlic, ginger, tikka masala paste, garam masala and cumin. Cook 2 minutes until fragrant.','Add diced chicken and stir to coat in the spices. Cook 3–4 minutes.','Pour in diced tomatoes, coconut milk and broth. Bring to a simmer.','Cook 20 minutes until chicken is cooked through and soup has thickened slightly.','Season with salt and pepper.','Serve topped with a swirl of Greek yogurt and fresh cilantro, with naan on the side.'],timesMade:0,isEasy:true},
                {id:2092,collection:'the-modern-proper',name:'Slow Cooker Chili',prepTime:'15 min',cookTime:360,servings:8,costPerServing:2.8,macros:{calories:360,protein:28,carbs:28,fat:14,fiber:8,sugar:6,sodium:580},tags:['Dinner','Soup','Gluten-Free','Easy'],image:'https://images.themodernproper.com/production/posts/Slow-CookerChili_8.jpg?w=800&q=82&auto=format&fit=crop&dm=1771276855&s=1eb6fd8638833b49ffd4d3ba43021410',ingredients:['1.5 lb ground beef','1 lb Italian sausage, casings removed','1 onion, diced','4 cloves garlic, minced','2 cans (15 oz each) kidney beans, drained','1 can (28 oz) crushed tomatoes','1 can (14 oz) diced tomatoes with green chiles','2 tbsp chili powder','1 tsp cumin','1 tsp smoked paprika','1/2 tsp oregano','Salt and pepper','Toppings: cheddar, sour cream, green onions, jalapeños'],instructions:['Brown ground beef and sausage in a skillet over medium-high heat. Drain fat. Add to slow cooker.','Cook onion in the same skillet 3 minutes. Add garlic and all spices, cook 1 minute. Add to slow cooker.','Add beans, crushed tomatoes and diced tomatoes to slow cooker. Stir everything together.','Cook on low 6–8 hours or high 3–4 hours.','Season with salt and pepper. Serve with your favorite toppings.'],timesMade:0,isEasy:true},
                {id:2093,collection:'the-modern-proper',name:'Baked Tilapia',prepTime:'5 min',cookTime:15,servings:4,costPerServing:4.0,macros:{calories:220,protein:34,carbs:4,fat:8,fiber:1,sugar:1,sodium:340},tags:['Dinner','Healthy','Gluten-Free','Easy'],image:'https://images.themodernproper.com/production/posts/2023/Baked-Tilapia_3.jpg?w=800&q=82&auto=format&fit=crop&crop=focalpoint&fp-x=0.4633&fp-y=0.3887&dm=1771350850&s=a32e4486a497cfd3417d28a27e0ecce1',ingredients:['4 tilapia fillets','3 tbsp olive oil','3 cloves garlic, minced','1 lemon, zested and juiced','1 tsp dried oregano','1/2 tsp smoked paprika','Salt and pepper','Fresh parsley and lemon slices to serve'],instructions:['Preheat oven to 400°F. Line a baking sheet with parchment.','Mix olive oil, garlic, lemon zest, lemon juice, oregano and paprika.','Place tilapia on the baking sheet. Spoon the garlic-herb mixture over each fillet.','Season with salt and pepper.','Bake 12–15 minutes until fish is opaque and flakes easily.','Serve with fresh parsley and lemon slices.'],timesMade:0,isEasy:true},
                {id:2094,collection:'the-modern-proper',name:'Shrimp and Grits',prepTime:'10 min',cookTime:25,servings:4,costPerServing:7.5,macros:{calories:480,protein:30,carbs:38,fat:22,fiber:2,sugar:4,sodium:720},tags:['Dinner','Gluten-Free'],image:'https://images.themodernproper.com/production/posts/ShrimpandGrits_9.jpg?w=800&q=82&auto=format&fit=crop&dm=1770681635&s=1d406a1689977a2cf3af964d7bbe7233',ingredients:['1.5 lb large shrimp, peeled and deveined','4 strips bacon, chopped','1 cup stone-ground grits','3 cups water or chicken broth','1 cup sharp cheddar, shredded','4 tbsp butter, divided','1 small onion, diced','3 cloves garlic, minced','1 cup chicken broth (for sauce)','2 tsp Cajun seasoning','Lemon juice, fresh parsley and green onions to serve'],instructions:['Bring 3 cups water or broth to a boil. Whisk in grits and reduce heat to low. Cook, stirring frequently, 20 minutes until thick and creamy. Stir in cheddar and 2 tbsp butter. Season well.','Cook bacon in a large skillet until crispy. Remove, leaving drippings in pan.','Season shrimp with Cajun seasoning. Cook in bacon drippings over high heat, 1–2 minutes per side. Remove.','In the same pan, cook onion until soft. Add garlic, cook 1 minute. Pour in broth and simmer 3 minutes.','Stir in remaining butter and lemon juice. Return shrimp and bacon.','Serve shrimp and sauce over grits. Top with parsley and green onions.'],timesMade:0,isEasy:false},
                {id:2095,collection:'the-modern-proper',name:'Panzanella',prepTime:'20 min',cookTime:15,servings:4,costPerServing:3.5,macros:{calories:320,protein:8,carbs:38,fat:16,fiber:4,sugar:8,sodium:480},tags:['Lunch','Vegetarian','Easy'],image:'https://images.themodernproper.com/production/posts/Panzanella_9.jpg?w=800&q=82&auto=format&fit=crop&dm=1721144616&s=9aa9c649c2c2b7659bd0c21e9c1fad79',ingredients:['4 cups rustic bread, torn into 1-inch pieces','4 large heirloom tomatoes, cut into chunks','1 English cucumber, sliced','1/2 red onion, thinly sliced','1/2 cup fresh basil, torn','1/4 cup Kalamata olives','Dressing: 1/4 cup olive oil, 3 tbsp red wine vinegar, 1 clove garlic minced, 1 tsp Dijon mustard, salt and pepper'],instructions:['Toss bread pieces with 2 tbsp olive oil and a pinch of salt. Spread on a baking sheet and toast at 400°F for 10–12 minutes until golden. Cool.','Whisk together dressing ingredients.','Combine tomatoes, cucumber, red onion and olives in a large bowl. Drizzle with half the dressing and let sit 15 minutes.','Add toasted bread and remaining dressing. Toss gently.','Fold in fresh basil.','Let sit 10 more minutes for bread to soak up the juices before serving.'],timesMade:0,isEasy:true},
                {id:2096,collection:'the-modern-proper',name:'Chicken Fricassee',prepTime:'15 min',cookTime:45,servings:4,costPerServing:6.5,macros:{calories:480,protein:42,carbs:14,fat:28,fiber:2,sugar:4,sodium:560},tags:['Dinner'],image:'https://images.themodernproper.com/production/posts/ChickenFricassee_12.jpg?w=800&q=82&auto=format&fit=crop&dm=1701734833&s=4db92ac9f0a3c33678838859f6e9fbd6',ingredients:['4 bone-in, skin-on chicken thighs','8 oz cremini mushrooms, sliced','1 onion, diced','3 cloves garlic, minced','1/2 cup dry white wine','1 cup chicken broth','1/2 cup heavy cream','1 tbsp fresh thyme','2 tbsp butter','2 tbsp flour','Salt and pepper','Fresh parsley and egg noodles or crusty bread to serve'],instructions:['Season chicken generously with salt and pepper.','Melt butter in a large skillet over medium-high heat. Brown chicken skin-side down 5–6 minutes until deeply golden. Flip and cook 3 more minutes. Remove.','In the same pan, cook onion and mushrooms until golden, 6–7 minutes. Add garlic, cook 1 minute. Sprinkle with flour and stir to coat.','Pour in wine and let bubble 2 minutes. Add broth and thyme.','Return chicken to the pan. Cover and simmer on low 25–30 minutes until chicken is cooked through.','Remove chicken. Stir cream into the sauce and simmer 3–4 minutes to thicken.','Return chicken, spoon sauce over, and serve with parsley.'],timesMade:0,isEasy:false},
                {id:2097,collection:'the-modern-proper',name:'Crock-Pot Potato Soup',prepTime:'15 min',cookTime:360,servings:8,costPerServing:2.2,macros:{calories:310,protein:10,carbs:42,fat:12,fiber:3,sugar:5,sodium:580},tags:['Dinner','Soup','Vegetarian','Easy'],image:'https://images.themodernproper.com/production/posts/Crock-potpotatosoup_9.jpg?w=800&q=82&auto=format&fit=crop&dm=1770498459&s=d8360ca558ee1f2cd3e54d3585a46dd4',ingredients:['2 lb Yukon Gold potatoes, peeled and diced','1 onion, diced','4 cloves garlic, minced','4 cups chicken or vegetable broth','1 cup sour cream','1 cup shredded sharp cheddar','4 tbsp butter','Salt and pepper','Toppings: extra cheddar, bacon bits, green onions, sour cream'],instructions:['Add potatoes, onion, garlic, broth and butter to the slow cooker. Season with salt and pepper.','Cook on low 7–8 hours or high 4 hours until potatoes are very tender.','Use a potato masher or immersion blender to mash/blend part of the soup to your desired texture — chunky or smooth.','Stir in sour cream and cheddar on low until melted and combined.','Taste and adjust seasoning.','Serve topped with extra cheese, bacon, green onions and sour cream.'],timesMade:0,isEasy:true},
                {id:2098,collection:'the-modern-proper',name:'Asian Salmon Sheet Pan Dinner',prepTime:'10 min',cookTime:20,servings:4,costPerServing:8.5,macros:{calories:400,protein:38,carbs:20,fat:18,fiber:4,sugar:10,sodium:640},tags:['Dinner','Healthy','Gluten-Free','Easy'],image:'https://images.themodernproper.com/production/posts/2020/Asian-Salmon-Sheet-Pan-Dinner-6.jpg?w=800&q=82&auto=format&fit=crop&dm=1770250265&s=a09a6c9ebd9e77d8f42fc403cbed6dee',ingredients:['4 salmon fillets (6 oz each)','2 cups broccoli florets','1 red bell pepper, sliced','1 cup snap peas','Sauce: 3 tbsp soy sauce, 2 tbsp honey, 1 tbsp sesame oil, 1 tbsp rice vinegar, 2 cloves garlic minced, 1 tsp fresh ginger grated','Sesame seeds and green onions to garnish','Rice to serve'],instructions:['Preheat oven to 400°F. Line a baking sheet with parchment.','Whisk together all sauce ingredients.','Toss broccoli, bell pepper and snap peas with half the sauce. Spread on the baking sheet.','Roast vegetables 10 minutes.','Push vegetables to the sides. Place salmon in the center and brush with remaining sauce.','Roast 12–15 minutes until salmon flakes easily and vegetables have caramelized edges.','Serve over rice with sesame seeds and green onions.'],timesMade:0,isEasy:true},
                {id:2099,collection:'the-modern-proper',name:'Chicken Piccata Meatballs',prepTime:'20 min',cookTime:25,servings:4,costPerServing:4.8,macros:{calories:380,protein:32,carbs:14,fat:22,fiber:1,sugar:2,sodium:580},tags:['Dinner'],image:'https://images.themodernproper.com/production/posts/ChickenPiccataMeatballs_13.jpg?w=800&q=82&auto=format&fit=crop&dm=1769884626&s=643d956b301e8edc9a2b16533626e3ed',ingredients:['1.5 lb ground chicken','1/3 cup breadcrumbs','1 egg','3 cloves garlic, minced','1/4 cup Parmesan, grated','2 tbsp fresh parsley','Salt and pepper','Piccata sauce: 4 tbsp butter, 3 tbsp capers, 1/2 cup white wine, 1/2 cup chicken broth, 3 tbsp lemon juice','Pasta or crusty bread to serve'],instructions:['Combine ground chicken, breadcrumbs, egg, garlic, Parmesan, parsley, salt and pepper. Roll into 1.5-inch meatballs.','Brown meatballs in olive oil in a large skillet over medium-high heat, turning to get golden all over. Remove.','In the same pan, add butter and capers. Cook 1 minute.','Pour in white wine and let bubble 1 minute. Add broth and lemon juice, simmer 3–4 minutes.','Return meatballs to the sauce, cover and simmer 10 minutes until cooked through.','Serve over pasta with extra parsley and lemon slices.'],timesMade:0,isEasy:false},
                {id:2100,collection:'the-modern-proper',name:'Creamy Spinach Pasta with Ricotta and Lemon',prepTime:'5 min',cookTime:20,servings:4,costPerServing:3.2,macros:{calories:480,protein:18,carbs:60,fat:18,fiber:4,sugar:4,sodium:420},tags:['Dinner','Vegetarian','Easy'],image:'https://images.themodernproper.com/production/posts/2021/CreamySpinachPastawithRicottaLemon_9.jpg?w=800&q=82&auto=format&fit=crop&dm=1769719213&s=f112e69655797f1802560b78d995225c',ingredients:['12 oz linguine or spaghetti','1 cup whole milk ricotta','3 cups baby spinach','4 cloves garlic, minced','1 lemon, zested and juiced','3 tbsp olive oil','1/2 cup Parmesan, grated, plus more to serve','1/4 tsp red pepper flakes','Salt and pepper','Fresh basil'],instructions:['Cook pasta per package directions. Reserve 1 cup pasta water, then drain.','Heat olive oil in a large skillet over medium heat. Cook garlic and red pepper flakes 1 minute.','Add spinach and toss until wilted.','Remove from heat. Stir in ricotta, lemon zest and lemon juice until smooth.','Add hot pasta and a splash of pasta water. Toss to coat, adding more water as needed for a silky sauce.','Stir in Parmesan. Season generously with salt and pepper.','Serve topped with more Parmesan and fresh basil.'],timesMade:0,isEasy:true},
                // Meal Prep on Fleek
                {id:2101,collection:'meal-prep-on-fleek',name:'Air Fryer Pork Rind Coated Pork Chops',prepTime:'10 min',cookTime:15,servings:4,costPerServing:4.5,macros:{calories:340,protein:42,carbs:2,fat:18,fiber:0,sugar:0,sodium:480},tags:['Dinner','Gluten-Free','Easy'],image:'https://mealpreponfleek.com/wp-content/uploads/2020/01/Air-Fryer-Pork-Rind-Coated-Pork-Chops-Paleo-Keto.jpg',ingredients:['4 boneless pork chops (6 oz each)','2 oz pork rinds, crushed to crumbs','1/2 tsp garlic powder','1/2 tsp onion powder','1/2 tsp smoked paprika','1/4 tsp cayenne','Salt and pepper','2 eggs, beaten','Avocado oil spray'],instructions:['Pat pork chops dry and season with salt and pepper.','Crush pork rinds into fine crumbs and mix with garlic powder, onion powder, paprika and cayenne.','Dip each pork chop in beaten egg, then press firmly into the pork rind coating on both sides.','Spray air fryer basket with avocado oil. Place pork chops in a single layer.','Air fry at 400°F for 12–15 minutes, flipping halfway, until internal temp reaches 145°F.','Rest 3 minutes before serving.'],timesMade:0,isEasy:true},
                {id:2102,collection:'meal-prep-on-fleek',name:'African Peanut Stew',prepTime:'15 min',cookTime:35,servings:6,costPerServing:3.2,macros:{calories:420,protein:24,carbs:38,fat:20,fiber:7,sugar:8,sodium:580},tags:['Dinner','Vegetarian','Vegan','Gluten-Free','Easy'],image:'https://mealpreponfleek.com/wp-content/uploads/2026/02/african-peanut-stew.jpg',ingredients:['1 lb chicken breast or chickpeas (for vegan)','1 large sweet potato, diced','1 can (14 oz) diced tomatoes','4 cups chicken or vegetable broth','1/2 cup natural peanut butter','1 onion, diced','4 cloves garlic, minced','1 tbsp fresh ginger, grated','1 tsp cumin','1 tsp turmeric','1/4 tsp cayenne','2 tbsp olive oil','Salt and pepper','Fresh cilantro and rice to serve'],instructions:['Heat olive oil in a large pot over medium heat. Cook onion 4 minutes until soft.','Add garlic, ginger, cumin, turmeric and cayenne. Cook 1 minute until fragrant.','Add sweet potato and stir to coat.','Pour in diced tomatoes and broth. Bring to a simmer.','Add chicken or chickpeas. Simmer 20 minutes until sweet potato is tender and chicken is cooked through.','Remove chicken if using and shred, then return to pot.','Stir in peanut butter until fully incorporated. Simmer 5 more minutes.','Season with salt and pepper. Serve over rice with cilantro.'],timesMade:0,isEasy:true},
                {id:2103,collection:'meal-prep-on-fleek',name:'Instant Pot Ranch Chicken Lettuce Wraps',prepTime:'10 min',cookTime:25,servings:6,costPerServing:3.8,macros:{calories:280,protein:36,carbs:6,fat:12,fiber:2,sugar:2,sodium:580},tags:['Lunch','Dinner','Gluten-Free','Easy'],image:'https://mealpreponfleek.com/wp-content/uploads/2019/01/instant-pot-keto-ranch-chicken.jpg',ingredients:['2 lb chicken breast','1 packet (1 oz) dry ranch seasoning','1/2 cup chicken broth','4 oz cream cheese, cubed','1/4 cup diced pickled jalapeños','1/2 cup shredded cheddar','Butter or romaine lettuce leaves','Toppings: avocado, sour cream, tomato, green onions, extra jalapeños'],instructions:['Place chicken in the Instant Pot. Sprinkle ranch seasoning over top and pour in broth.','Seal the lid and cook on High Pressure for 15 minutes. Quick release.','Remove chicken and shred with two forks. Return to the pot.','Add cream cheese cubes and jalapeños. Stir on the Sauté function until cream cheese is melted and sauce is creamy.','Stir in cheddar.','Serve in lettuce cups with avocado, sour cream, tomato and green onions.'],timesMade:0,isEasy:true},
                {id:2104,collection:'meal-prep-on-fleek',name:'Air Fryer Garlic Parmesan Chicken Wings',prepTime:'10 min',cookTime:25,servings:4,costPerServing:5.5,macros:{calories:420,protein:36,carbs:4,fat:28,fiber:0,sugar:1,sodium:540},tags:['Dinner','Appetizer','Gluten-Free','Easy'],image:'https://mealpreponfleek.com/wp-content/uploads/2019/11/Air-Fryer-Garlic-Parmesan-Chicken-Wings-1.jpg',ingredients:['2 lb chicken wings, split at joint','1 tsp baking powder','1 tsp garlic powder','Salt and pepper','Garlic Parmesan sauce: 4 tbsp butter, 4 cloves garlic minced, 1/3 cup Parmesan grated, 2 tbsp fresh parsley, pinch of red pepper flakes'],instructions:['Pat wings completely dry — the drier the better for crispy skin.','Toss with baking powder, garlic powder, salt and pepper. This helps achieve maximum crispiness.','Preheat air fryer to 380°F. Cook wings 20 minutes, flipping halfway.','Increase to 400°F and cook 5 more minutes until deeply golden and crispy.','While wings cook, melt butter in a pan. Cook garlic 1 minute. Remove from heat and stir in Parmesan, parsley and red pepper flakes.','Toss hot wings in the garlic Parmesan sauce and serve immediately.'],timesMade:0,isEasy:true},
                {id:2105,collection:'meal-prep-on-fleek',name:'High Protein Griddle Steak Fried Rice',prepTime:'15 min',cookTime:20,servings:4,costPerServing:5.8,macros:{calories:520,protein:38,carbs:44,fat:20,fiber:3,sugar:4,sodium:780},tags:['Dinner','Meal Prep','Easy'],image:'https://mealpreponfleek.com/wp-content/uploads/2026/01/High-Protein-Griddle-Fried-Rice-Meal-Prep-top-down.jpg',ingredients:['1 lb sirloin steak, thinly sliced','3 cups cooked and cooled white rice (day-old is best)','3 eggs, lightly beaten','1 cup frozen peas and carrots','3 cloves garlic, minced','3 tbsp soy sauce','1 tbsp oyster sauce','1 tbsp sesame oil','1 tbsp avocado oil','Salt and pepper','Green onions and sesame seeds to serve'],instructions:['Heat a griddle or large cast iron skillet over high heat with avocado oil.','Season steak with salt and pepper. Cook 2–3 minutes per side until nicely seared. Rest and slice thin.','On the same hot griddle, scramble eggs quickly. Push to the side.','Add frozen vegetables and garlic. Cook 2 minutes.','Add rice, breaking up any clumps. Cook 3–4 minutes, pressing against the griddle for crispy bits.','Drizzle soy sauce, oyster sauce and sesame oil over everything. Toss and cook 1 more minute.','Add sliced steak and toss together.','Serve topped with green onions and sesame seeds.'],timesMade:0,isEasy:true},
                {id:2106,collection:'meal-prep-on-fleek',name:'Homemade Chicken Doner Wraps',prepTime:'20 min',cookTime:15,servings:4,costPerServing:4.8,macros:{calories:480,protein:38,carbs:38,fat:18,fiber:3,sugar:5,sodium:620},tags:['Lunch','Dinner','Meal Prep','Easy'],image:'https://mealpreponfleek.com/wp-content/uploads/2025/11/viral-homemade-Chicken-Doner-Wraps.jpg',ingredients:['1.5 lb chicken thighs, boneless','Doner marinade: 1/4 cup olive oil, 3 cloves garlic minced, 1 tsp cumin, 1 tsp smoked paprika, 1 tsp oregano, 1/2 tsp turmeric, 1/2 tsp cayenne, 1 lemon juiced, salt and pepper','4 large flatbreads or tortillas','Garlic sauce: 1/2 cup mayo, 2 cloves garlic minced, 1 tbsp lemon juice, salt','Toppings: shredded cabbage, tomato, red onion, cucumber, fresh parsley'],instructions:['Mix all marinade ingredients. Coat chicken thoroughly and marinate 30 minutes or overnight.','Cook chicken in a hot skillet or grill pan over medium-high heat, 5–6 minutes per side. Rest 5 minutes then slice thin.','Mix garlic sauce ingredients and set aside.','Warm flatbreads.','Build wraps: garlic sauce first, then chicken, then shredded cabbage, tomato, onion, cucumber and parsley.','Wrap tightly and enjoy immediately, or wrap in foil for meal prep.'],timesMade:0,isEasy:true},
                {id:2107,collection:'meal-prep-on-fleek',name:'Greek Arugula Power Salad',prepTime:'15 min',cookTime:0,servings:4,costPerServing:3.5,macros:{calories:320,protein:14,carbs:20,fat:22,fiber:5,sugar:6,sodium:420},tags:['Lunch','Vegetarian','Gluten-Free','Easy'],image:'https://mealpreponfleek.com/wp-content/uploads/2020/10/Greek-Arugula-Salad-Single-Conainer-e1761565785177.jpg',ingredients:['4 cups arugula','1 cup chickpeas, drained and rinsed','1 cup cherry tomatoes, halved','1 English cucumber, sliced','1/2 cup Kalamata olives, pitted','1/2 cup red onion, thinly sliced','1/2 cup feta, crumbled','Greek dressing: 3 tbsp olive oil, 2 tbsp red wine vinegar, 1 tsp dried oregano, 1 clove garlic minced, 1/2 tsp Dijon, salt and pepper'],instructions:['Combine arugula, chickpeas, cherry tomatoes, cucumber, olives and red onion in a large bowl.','Whisk together all dressing ingredients.','Drizzle dressing over the salad and toss gently.','Top with crumbled feta.','For meal prep, keep dressing separate and add just before eating.'],timesMade:0,isEasy:true},
                {id:2108,collection:'meal-prep-on-fleek',name:'Salsa Verde Chicken Enchiladas',prepTime:'20 min',cookTime:30,servings:6,costPerServing:3.8,macros:{calories:380,protein:32,carbs:28,fat:16,fiber:4,sugar:4,sodium:680},tags:['Dinner','Meal Prep','Gluten-Free','Easy'],image:'https://mealpreponfleek.com/wp-content/uploads/2018/05/6O0A1793-e1767707094661.jpg',ingredients:['2 cups cooked chicken, shredded','12 corn tortillas','2 cups salsa verde, divided','1.5 cups shredded Monterey Jack cheese, divided','1/2 cup sour cream','1 tsp cumin','Salt and pepper','Toppings: avocado, cilantro, sour cream, lime'],instructions:['Preheat oven to 375°F.','Mix shredded chicken with 1/2 cup salsa verde, cumin, half the cheese, salt and pepper.','Warm tortillas to make them pliable (microwave 30 seconds wrapped in a damp paper towel).','Spread 1/2 cup salsa verde on the bottom of a 9x13 baking dish.','Fill each tortilla with chicken mixture and roll tightly. Place seam-side down in the dish.','Pour remaining salsa verde over the enchiladas and top with remaining cheese.','Bake 25–30 minutes until bubbly and cheese is melted.','Serve with avocado, cilantro, sour cream and lime.'],timesMade:0,isEasy:true},
                {id:2109,collection:'meal-prep-on-fleek',name:'Lemon Herb Chicken and Potato Sheet Pan',prepTime:'15 min',cookTime:35,servings:4,costPerServing:4.2,macros:{calories:440,protein:38,carbs:32,fat:18,fiber:4,sugar:3,sodium:420},tags:['Dinner','Meal Prep','Gluten-Free','Easy'],image:'https://mealpreponfleek.com/wp-content/uploads/2018/12/6O0A2957-e1767618796843.jpg',ingredients:['1.5 lb chicken thighs, bone-in skin-on','1.5 lb baby potatoes, halved','1 head broccoli, cut into florets','4 cloves garlic, minced','1 lemon, zested and juiced','3 tbsp olive oil','1 tsp dried rosemary','1 tsp dried thyme','1 tsp garlic powder','Salt and pepper'],instructions:['Preheat oven to 425°F. Line a large baking sheet with parchment.','Toss potatoes with 1.5 tbsp olive oil, rosemary, thyme, garlic powder, salt and pepper. Spread on the baking sheet.','Roast potatoes 15 minutes.','Toss chicken thighs with remaining olive oil, garlic, lemon zest, salt and pepper. Nestle on the baking sheet with the potatoes.','Roast 15 more minutes. Add broccoli to the baking sheet, drizzle with a little oil.','Roast a final 10 minutes until chicken is cooked through and everything is golden.','Squeeze lemon juice over everything before serving.'],timesMade:0,isEasy:true},
                {id:2110,collection:'meal-prep-on-fleek',name:'Cheesy Keto Chicken Meatballs',prepTime:'15 min',cookTime:20,servings:6,costPerServing:3.8,macros:{calories:310,protein:36,carbs:3,fat:18,fiber:0,sugar:1,sodium:460},tags:['Dinner','Meal Prep','Gluten-Free','Easy'],image:'https://mealpreponfleek.com/wp-content/uploads/2019/05/Cheesy-Keto-Chicken-Meatballs.jpg',ingredients:['1.5 lb ground chicken','1 cup shredded mozzarella','1/4 cup Parmesan, grated','1 egg','3 cloves garlic, minced','1 tsp Italian seasoning','1/2 tsp onion powder','Salt and pepper','Marinara sauce for serving (optional)'],instructions:['Preheat oven to 400°F. Line a baking sheet with parchment.','Combine ground chicken, mozzarella, Parmesan, egg, garlic, Italian seasoning, onion powder, salt and pepper. Mix until just combined.','Roll into 1.5-inch meatballs — the mixture will be soft, use wet hands if needed.','Bake 18–20 minutes until cooked through and lightly golden.','Serve as-is for a keto meal, or alongside marinara and zucchini noodles.','Stores great in the fridge for 4 days or freezer for 3 months.'],timesMade:0,isEasy:true},
                // Workweek Lunch
                {id:2111,collection:'workweek-lunch',name:'20-Minute Ground Beef Pasta With Swiss Chard',prepTime:'5 min',cookTime:20,servings:4,costPerServing:3.2,macros:{calories:480,protein:30,carbs:52,fat:16,fiber:4,sugar:5,sodium:480},tags:['Dinner','Meal Prep','Easy'],image:'https://workweeklunch.com/wp-content/uploads/2022/03/swiss-chard-pasta-cookbook-2.jpg',ingredients:['12 oz pasta (rotini or penne)','1 lb ground beef','1 bunch Swiss chard, stems removed and leaves chopped','4 cloves garlic, minced','1 can (14 oz) diced tomatoes','1/2 cup beef or chicken broth','1 tsp Italian seasoning','1/2 tsp red pepper flakes','2 tbsp olive oil','Salt and pepper','Parmesan to serve'],instructions:['Cook pasta per package directions. Reserve 1/2 cup pasta water, drain.','Heat olive oil in a large skillet over medium-high heat. Brown ground beef, breaking it apart. Drain fat.','Add garlic, Italian seasoning and red pepper flakes. Cook 1 minute.','Add diced tomatoes and broth. Simmer 5 minutes.','Stir in Swiss chard and cook until wilted, about 2 minutes.','Add pasta and toss to combine, using pasta water to loosen if needed.','Season with salt and pepper. Top with Parmesan.'],timesMade:0,isEasy:true},
                {id:2112,collection:'workweek-lunch',name:'Veggie Mac and Cheese With Cauliflower, Zucchini, and Bell Pepper',prepTime:'10 min',cookTime:25,servings:6,costPerServing:2.8,macros:{calories:400,protein:16,carbs:52,fat:15,fiber:4,sugar:6,sodium:420},tags:['Dinner','Vegetarian','Meal Prep','Easy'],image:'https://workweeklunch.com/wp-content/uploads/2022/02/cauliflower-mac-and-chesse.png',ingredients:['12 oz elbow macaroni','2 cups cauliflower florets, cut small','1 zucchini, diced','1 red bell pepper, diced','3 tbsp butter','3 tbsp flour','2 cups whole milk','1.5 cups sharp cheddar, shredded','1/2 cup Gruyere or extra cheddar','1/2 tsp garlic powder','1/2 tsp mustard powder','Salt and pepper'],instructions:['Cook pasta per package directions. In the last 3 minutes, add cauliflower to the boiling water. Drain together.','In the same pot, melt butter over medium heat. Whisk in flour and cook 1 minute.','Gradually whisk in milk until smooth. Cook, stirring, until thickened, about 4 minutes.','Remove from heat. Stir in cheddar, Gruyere, garlic powder and mustard powder until melted.','Fold in pasta, cauliflower, zucchini and bell pepper. Stir to combine.','Season with salt and pepper. Serve immediately or portion into meal prep containers.'],timesMade:0,isEasy:true},
                {id:2113,collection:'workweek-lunch',name:'The Easiest Chicken Burrito Bowl',prepTime:'10 min',cookTime:20,servings:4,costPerServing:3.8,macros:{calories:480,protein:38,carbs:46,fat:14,fiber:8,sugar:4,sodium:580},tags:['Lunch','Dinner','Meal Prep','Gluten-Free','Easy'],image:'https://workweeklunch.com/wp-content/uploads/2022/01/burrito-bowl-updated-2-1.jpg',ingredients:['1.5 lb chicken breast','2 tsp chili powder','1 tsp cumin','1 tsp garlic powder','1/2 tsp smoked paprika','Salt and pepper','2 cups cooked rice','1 can (15 oz) black beans, drained','1 cup corn (frozen or canned)','1 cup salsa or pico de gallo','1 avocado, sliced or diced','Sour cream, shredded cheese, cilantro and lime to serve'],instructions:['Season chicken with chili powder, cumin, garlic powder, paprika, salt and pepper.','Cook in a skillet over medium-high heat with a drizzle of oil, 6–7 minutes per side until cooked through. Rest 5 minutes, then slice or dice.','Warm beans and corn in a small pot or microwave.','Build bowls: rice, chicken, beans, corn, salsa and avocado.','Top with sour cream, cheese, cilantro and a squeeze of lime.','For meal prep, store components separately and assemble when ready to eat.'],timesMade:0,isEasy:true},
                {id:2114,collection:'workweek-lunch',name:'Freezer-Friendly Veggie Breakfast Burritos',prepTime:'15 min',cookTime:15,servings:6,costPerServing:2.2,macros:{calories:380,protein:18,carbs:42,fat:16,fiber:4,sugar:4,sodium:520},tags:['Breakfast','Vegetarian','Meal Prep','Easy'],image:'https://workweeklunch.com/wp-content/uploads/2019/08/breakfast-burrito-how-to-4-1024x1024.jpg',ingredients:['6 large flour tortillas','8 eggs, beaten','1 can (15 oz) black beans, drained','1 bell pepper, diced','1/2 onion, diced','1 cup baby spinach','1 cup shredded Mexican cheese','1 tsp cumin','1/2 tsp chili powder','Salt and pepper','Salsa and sour cream to serve'],instructions:['Cook onion and bell pepper in a skillet with a drizzle of oil over medium heat, 4–5 minutes until soft.','Add cumin and chili powder, stir to coat.','Add spinach and cook until wilted, 1 minute.','Pour in beaten eggs. Season with salt and pepper. Scramble until just set — slightly undercook since they\'ll continue cooking when reheated.','Warm tortillas. Divide egg mixture, black beans and cheese evenly among them.','Roll into tight burritos. For freezer prep, wrap each in foil then store in a freezer bag for up to 3 months.','Reheat from frozen: unwrap foil, microwave 2–3 minutes flipping halfway, or bake at 350°F for 20 minutes.'],timesMade:0,isEasy:true},
                {id:2115,collection:'workweek-lunch',name:'Orange Chicken (Trader Joe\'s Copycat)',prepTime:'15 min',cookTime:20,servings:4,costPerServing:4.2,macros:{calories:420,protein:32,carbs:42,fat:12,fiber:1,sugar:22,sodium:560},tags:['Dinner','Meal Prep','Easy'],image:'https://workweeklunch.com/wp-content/uploads/2020/10/close-up-orange-chicken-1024x1024.jpg',ingredients:['1.5 lb chicken breast, cut into 1-inch pieces','1/2 cup cornstarch','2 eggs, beaten','Salt and pepper','Oil for frying or baking','Orange sauce: 1/2 cup orange juice, 3 tbsp soy sauce, 2 tbsp rice vinegar, 2 tbsp honey, 1 tbsp brown sugar, 2 cloves garlic minced, 1 tsp fresh ginger grated, 1 tbsp cornstarch','Sesame seeds, green onions and rice to serve'],instructions:['Season chicken with salt and pepper. Dip in beaten egg, then toss in cornstarch to coat.','To bake: spread on a greased sheet pan and bake at 425°F for 18–20 minutes, flipping halfway, until golden. To fry: cook in 1 inch of oil at 375°F in batches, 3–4 minutes per side.','Whisk all orange sauce ingredients together in a small saucepan. Bring to a simmer over medium heat, stirring until thickened, 2–3 minutes.','Toss hot chicken in the orange sauce immediately.','Serve over rice topped with sesame seeds and green onions.'],timesMade:0,isEasy:true},
                {id:2116,collection:'workweek-lunch',name:'Blueberry Lemon Pancakes',prepTime:'10 min',cookTime:20,servings:4,costPerServing:2.0,macros:{calories:340,protein:9,carbs:56,fat:10,fiber:2,sugar:16,sodium:380},tags:['Breakfast','Vegetarian','Meal Prep','Easy'],image:'https://workweeklunch.com/wp-content/uploads/2021/05/blueberry-lemon-pancakes-scaled-e1769435055314-744x1024.jpg',ingredients:['1.5 cups all-purpose flour','2 tsp baking powder','1/2 tsp baking soda','1/4 tsp salt','2 tbsp sugar','1 cup buttermilk','1 egg','2 tbsp melted butter','1 lemon, zested and juiced','1 tsp vanilla extract','1 cup fresh or frozen blueberries','Maple syrup and extra blueberries to serve'],instructions:['Whisk together flour, baking powder, baking soda, salt and sugar.','In another bowl, whisk buttermilk, egg, melted butter, lemon zest, lemon juice and vanilla.','Pour wet ingredients into dry and stir until just combined — lumps are fine. Don\'t overmix.','Gently fold in blueberries.','Heat a non-stick skillet or griddle over medium heat. Grease lightly with butter.','Pour 1/4 cup batter per pancake. Cook until bubbles form on the surface and edges look set, 2–3 minutes. Flip and cook 1–2 more minutes.','For meal prep, let cool completely and stack with parchment between. Refrigerate up to 4 days or freeze up to 2 months. Reheat in the toaster or microwave.'],timesMade:0,isEasy:true},
                {id:2117,collection:'workweek-lunch',name:'Our Favorite BBQ Wings',prepTime:'10 min',cookTime:50,servings:4,costPerServing:5.0,macros:{calories:440,protein:36,carbs:18,fat:24,fiber:0,sugar:14,sodium:580},tags:['Dinner','Appetizer','Gluten-Free','Easy'],image:'https://workweeklunch.com/wp-content/uploads/2022/06/bbq-wings-july-4th-3-1024x1024-1.jpg',ingredients:['2.5 lb chicken wings, split at joint','1 tsp baking powder','1 tsp garlic powder','1 tsp smoked paprika','Salt and pepper','1 cup BBQ sauce of choice (sweet, smoky or spicy)','Celery sticks and ranch to serve'],instructions:['Preheat oven to 400°F. Line a baking sheet with foil and place a wire rack on top.','Pat wings completely dry with paper towels — essential for crispy skin.','Toss wings with baking powder, garlic powder, paprika, salt and pepper.','Arrange in a single layer on the rack. Bake 40 minutes, flipping halfway.','Brush wings generously with BBQ sauce. Return to oven and bake 8–10 more minutes until sticky and caramelized.','Let rest 2 minutes. Serve with celery and ranch.'],timesMade:0,isEasy:true},
                {id:2118,collection:'workweek-lunch',name:'Air Fryer Garlic Parmesan Chicken Wings',prepTime:'10 min',cookTime:25,servings:4,costPerServing:5.0,macros:{calories:400,protein:34,carbs:4,fat:26,fiber:0,sugar:1,sodium:520},tags:['Dinner','Appetizer','Gluten-Free','Easy'],image:'https://workweeklunch.com/wp-content/uploads/2023/06/air-fryer-chicken-wings-800x800-1.jpg',ingredients:['2 lb chicken wings, split at joint','1 tsp baking powder','1 tsp garlic powder','Salt and pepper','Garlic Parmesan sauce: 4 tbsp melted butter, 4 cloves garlic minced, 1/3 cup Parmesan grated, 2 tbsp fresh parsley, pinch of red pepper flakes','Ranch or blue cheese for dipping'],instructions:['Pat wings completely dry. Toss with baking powder, garlic powder, salt and pepper.','Preheat air fryer to 380°F. Arrange wings in a single layer — work in batches if needed.','Air fry 20 minutes, flipping halfway.','Increase heat to 400°F and air fry 5 more minutes until deeply golden and crispy.','While wings cook, mix melted butter, garlic, Parmesan, parsley and red pepper flakes.','Toss hot wings in the garlic Parmesan sauce immediately. Serve with ranch or blue cheese.'],timesMade:0,isEasy:true},
                {id:2119,collection:'workweek-lunch',name:'Easy Turkey Meatballs With Pesto Pasta',prepTime:'15 min',cookTime:25,servings:4,costPerServing:4.0,macros:{calories:510,protein:36,carbs:48,fat:18,fiber:3,sugar:3,sodium:540},tags:['Dinner','Meal Prep','Easy'],image:'https://workweeklunch.com/wp-content/uploads/2023/04/meatballs.with_.kale_.and_.pesto_.pasta-9-scaled.jpg',ingredients:['1 lb ground turkey','1/4 cup breadcrumbs','1 egg','3 cloves garlic, minced','1/4 cup Parmesan, grated','2 tbsp fresh parsley','Salt and pepper','12 oz pasta (penne or rotini)','1/2 cup pesto (store-bought or homemade)','2 cups baby kale or spinach','Extra Parmesan and lemon to serve'],instructions:['Preheat oven to 400°F. Line a baking sheet with parchment.','Combine turkey, breadcrumbs, egg, garlic, Parmesan, parsley, salt and pepper. Mix gently and roll into 1.5-inch meatballs.','Bake 18–20 minutes until cooked through and lightly golden.','Meanwhile, cook pasta per package directions. Reserve 1/4 cup pasta water, drain.','Toss hot pasta with pesto and kale — the heat will wilt the greens. Add pasta water to loosen.','Serve pasta topped with meatballs, extra Parmesan and a squeeze of lemon.'],timesMade:0,isEasy:true},
                
                // Sweet Peas & Saffron
                {id:2121,collection:'sweet-peas-saffron',name:'Juicy Baked Chicken Breast',prepTime:'5 min',cookTime:25,servings:4,costPerServing:3.8,macros:{calories:260,protein:42,carbs:2,fat:9,fiber:0,sugar:0,sodium:380},tags:['Dinner','Healthy','Gluten-Free','Easy','Meal Prep'],image:'https://sweetpeasandsaffron.com/wp-content/uploads/2018/07/Perfect-Baked-Chicken-Breast-7-600x600.jpg',ingredients:['4 chicken breasts (6–8 oz each)','2 tbsp olive oil','1 tsp garlic powder','1 tsp smoked paprika','1/2 tsp onion powder','1/2 tsp dried oregano','Salt and pepper'],instructions:['Preheat oven to 425°F.','Pat chicken dry. Pound thicker ends slightly to even out thickness — this is the key to even cooking.','Rub with olive oil, then season all over with garlic powder, paprika, onion powder, oregano, salt and pepper.','Place in a baking dish or on a rimmed sheet pan.','Bake 20–25 minutes until internal temp reaches 165°F. Do not overcook.','Rest 5 minutes before slicing — this keeps all the juices in.'],timesMade:0,isEasy:true},
                {id:2122,collection:'sweet-peas-saffron',name:'Instant Pot Creamy Lemon Chicken Breasts',prepTime:'10 min',cookTime:20,servings:4,costPerServing:4.5,macros:{calories:360,protein:40,carbs:6,fat:18,fiber:0,sugar:2,sodium:420},tags:['Dinner','Gluten-Free','Easy'],image:'https://sweetpeasandsaffron.com/wp-content/uploads/2018/03/Instant-Pot-creamy-lemon-garlic-chicken-breasts-4-600x600.jpg',ingredients:['4 chicken breasts','1 tbsp olive oil','4 cloves garlic, minced','1/2 cup chicken broth','1/2 cup heavy cream','2 tbsp lemon juice','1 tsp lemon zest','1 tsp Italian seasoning','Salt and pepper','Fresh parsley and pasta or rice to serve'],instructions:['Set Instant Pot to Sauté. Heat olive oil and sear chicken breasts 2 minutes per side until golden. Remove.','Add garlic and cook 30 seconds. Pour in broth to deglaze, scraping up any brown bits.','Stir in lemon juice, zest and Italian seasoning.','Return chicken to the pot. Seal lid and cook on High Pressure for 8 minutes.','Quick release. Remove chicken and set aside.','Set to Sauté. Stir in cream and simmer 3–4 minutes until sauce thickens slightly.','Return chicken, spoon sauce over and serve with fresh parsley.'],timesMade:0,isEasy:true},
                {id:2123,collection:'sweet-peas-saffron',name:'Thai Slow Cooker Chicken and Wild Rice Soup',prepTime:'10 min',cookTime:360,servings:6,costPerServing:3.5,macros:{calories:340,protein:30,carbs:32,fat:10,fiber:3,sugar:5,sodium:560},tags:['Dinner','Soup','Gluten-Free','Easy','Meal Prep'],image:'https://sweetpeasandsaffron.com/wp-content/uploads/2016/10/Thai-Slow-Cooker-Chicken-Wild-Rice-Soup-3-600x600.jpg',ingredients:['1.5 lb chicken breast','1/2 cup wild rice blend, uncooked','1 can (14 oz) coconut milk','4 cups chicken broth','2 tbsp red curry paste','1 tbsp fish sauce','1 tbsp fresh ginger, grated','3 cloves garlic, minced','1 red bell pepper, diced','1 cup frozen corn','Lime juice, cilantro and green onions to serve'],instructions:['Add chicken, wild rice, coconut milk, broth, curry paste, fish sauce, ginger, garlic and bell pepper to the slow cooker.','Cook on low 6–7 hours or high 3–4 hours until chicken is cooked through and rice is tender.','Remove chicken and shred with two forks. Return to the pot.','Stir in frozen corn and let warm through 10 minutes.','Adjust seasoning — add more fish sauce for saltiness or curry paste for heat.','Serve topped with fresh lime juice, cilantro and green onions.'],timesMade:0,isEasy:true},
                {id:2124,collection:'sweet-peas-saffron',name:'Easy Stir Fry Sauce',prepTime:'5 min',cookTime:0,servings:4,costPerServing:0.6,macros:{calories:60,protein:2,carbs:10,fat:1,fiber:0,sugar:7,sodium:640},tags:['Condiment','Vegan','Gluten-Free','Easy'],image:'https://sweetpeasandsaffron.com/wp-content/uploads/2016/10/7-Easy-Stir-Fry-Sauce-Recipes-you-can-make-ahead-3-600x600.jpg',ingredients:['3 tbsp low-sodium soy sauce','1 tbsp oyster sauce (or hoisin for vegan)','1 tbsp honey or maple syrup','1 tsp sesame oil','1 tsp rice vinegar','2 cloves garlic, minced','1 tsp fresh ginger, grated','1 tsp cornstarch (to thicken when cooked)','Optional: 1/2 tsp chili garlic sauce for heat'],instructions:['Whisk all ingredients together in a small bowl until the cornstarch is fully dissolved.','This sauce keeps in the fridge in a sealed jar for up to 1 week — make a double batch for easy weeknight stir fries.','To use: add to your stir fry in the last 2 minutes of cooking over high heat, tossing until everything is coated and the sauce thickens.','Works great with any protein (chicken, shrimp, beef, tofu) and any vegetables.'],timesMade:0,isEasy:true},
                {id:2125,collection:'sweet-peas-saffron',name:'Sweet Chili Shrimp Stir Fry',prepTime:'10 min',cookTime:15,servings:4,costPerServing:5.5,macros:{calories:310,protein:26,carbs:28,fat:8,fiber:3,sugar:14,sodium:620},tags:['Dinner','Gluten-Free','Easy'],image:'https://sweetpeasandsaffron.com/wp-content/uploads/2018/03/easy-sweet-chili-shrimp-stir-fry-600x600.jpg',ingredients:['1 lb large shrimp, peeled and deveined','2 cups broccoli florets','1 red bell pepper, sliced','1 cup snap peas','3 cloves garlic, minced','1/4 cup sweet chili sauce','2 tbsp soy sauce','1 tbsp sesame oil','1 tbsp rice vinegar','2 tbsp oil for cooking','Sesame seeds, green onions and rice to serve'],instructions:['Whisk together sweet chili sauce, soy sauce, sesame oil and rice vinegar. Set aside.','Heat oil in a large skillet or wok over high heat.','Add broccoli and bell pepper. Stir fry 3 minutes.','Add snap peas and garlic. Cook 1 minute more.','Push vegetables to the side. Add shrimp and cook 1–2 minutes per side until pink.','Pour sauce over everything and toss over high heat 1 minute until everything is coated and glossy.','Serve over rice with sesame seeds and green onions.'],timesMade:0,isEasy:true},
                {id:2126,collection:'sweet-peas-saffron',name:'Maple Ginger Cashew Chicken Stir Fry',prepTime:'15 min',cookTime:15,servings:4,costPerServing:5.0,macros:{calories:400,protein:34,carbs:28,fat:16,fiber:3,sugar:16,sodium:580},tags:['Dinner','Gluten-Free','Easy'],image:'https://sweetpeasandsaffron.com/wp-content/uploads/2020/01/maple-ginger-stir-fry-3-600x600.jpg',ingredients:['1.5 lb chicken breast, thinly sliced','1/2 cup raw cashews','2 cups broccoli florets','1 red bell pepper, sliced','3 cloves garlic, minced','Sauce: 3 tbsp maple syrup, 3 tbsp soy sauce, 1 tbsp fresh ginger grated, 1 tbsp rice vinegar, 1 tsp sesame oil, 1 tsp cornstarch','2 tbsp oil for cooking','Rice to serve'],instructions:['Whisk all sauce ingredients together and set aside.','Heat a dry skillet over medium heat. Toast cashews 2–3 minutes until golden. Set aside.','Heat oil in the same skillet over high heat. Cook chicken in a single layer, 3–4 minutes per side until golden and cooked through. Remove.','Add broccoli and bell pepper. Stir fry 3 minutes. Add garlic and cook 30 seconds.','Return chicken to the pan. Pour sauce over everything and toss over high heat until thick and glossy, about 1 minute.','Add cashews and serve over rice.'],timesMade:0,isEasy:true},
                {id:2127,collection:'sweet-peas-saffron',name:'Kale Chicken Pasta Salad',prepTime:'20 min',cookTime:15,servings:4,costPerServing:4.2,macros:{calories:440,protein:30,carbs:42,fat:16,fiber:4,sugar:5,sodium:480},tags:['Lunch','Meal Prep','Easy'],image:'https://sweetpeasandsaffron.com/wp-content/uploads/2019/04/kale-pasta-salad-5-600x600.jpg',ingredients:['8 oz rotini or penne','2 cups cooked chicken breast, diced','2 cups kale, stems removed and finely chopped','1/2 cup cherry tomatoes, halved','1/4 cup Kalamata olives, pitted','1/4 cup Parmesan, shaved','Lemon dressing: 3 tbsp olive oil, 2 tbsp lemon juice, 1 tsp Dijon mustard, 1 clove garlic minced, salt and pepper'],instructions:['Cook pasta per package directions. Drain and rinse with cold water.','Whisk together all dressing ingredients.','Place kale in a large bowl and pour half the dressing over it. Massage the kale with your hands for 2 minutes — this softens it and takes away the bitterness.','Add pasta, chicken, tomatoes and olives. Pour remaining dressing and toss.','Top with shaved Parmesan.','This salad holds up well for 4 days in the fridge, making it perfect for meal prep.'],timesMade:0,isEasy:true},
                {id:2128,collection:'sweet-peas-saffron',name:'Enchilada Sweet Potato Noodles Skillet',prepTime:'15 min',cookTime:20,servings:4,costPerServing:3.5,macros:{calories:320,protein:20,carbs:36,fat:12,fiber:7,sugar:8,sodium:580},tags:['Dinner','Gluten-Free','Easy'],image:'https://sweetpeasandsaffron.com/wp-content/uploads/2016/02/Spiralized-Sweet-Potato-Enchilada-Skillet-600x600.jpg',ingredients:['2 large sweet potatoes, spiralized or cut into thin noodles','1 lb ground beef or turkey','1 can (15 oz) black beans, drained','1 cup enchilada sauce (store-bought or homemade)','1/2 cup shredded Mexican cheese','1 tsp cumin','1 tsp chili powder','Salt and pepper','Fresh cilantro, avocado and sour cream to serve'],instructions:['Brown ground meat in a large oven-safe skillet over medium-high heat. Drain fat. Season with cumin, chili powder, salt and pepper.','Add black beans and sweet potato noodles. Stir to combine.','Pour enchilada sauce over everything. Cover and cook 8–10 minutes over medium heat until sweet potatoes are tender.','Sprinkle cheese over the top.','For a bubbly top: place under the broiler 2–3 minutes until cheese is melted and slightly browned.','Serve topped with cilantro, avocado and sour cream.'],timesMade:0,isEasy:true},
                {id:2129,collection:'sweet-peas-saffron',name:'Sheet Pan Chicken Fajitas',prepTime:'10 min',cookTime:25,servings:4,costPerServing:4.2,macros:{calories:380,protein:36,carbs:24,fat:14,fiber:4,sugar:5,sodium:520},tags:['Dinner','Gluten-Free','Easy','Meal Prep'],image:'https://sweetpeasandsaffron.com/wp-content/uploads/2019/10/chicken-fajitas-3-600x600.jpg',ingredients:['1.5 lb chicken breast, sliced into strips','2 bell peppers (different colors), sliced','1 red onion, sliced','3 tbsp olive oil','2 tsp chili powder','1 tsp cumin','1 tsp garlic powder','1/2 tsp smoked paprika','Salt and pepper','Flour or corn tortillas','Toppings: sour cream, guacamole, salsa, lime, cilantro'],instructions:['Preheat oven to 425°F. Line a large baking sheet with parchment.','Toss chicken strips, bell peppers and onion with olive oil and all spices. Spread in a single layer on the baking sheet — don\'t crowd.','Roast 20–25 minutes until chicken is cooked through and vegetables have charred edges. Toss halfway through.','Warm tortillas directly on the oven rack for the last 2 minutes.','Serve fajita-style with all your favorite toppings.'],timesMade:0,isEasy:true},
                {id:2130,collection:'sweet-peas-saffron',name:'Lemon Chicken Baked Gnocchi',prepTime:'10 min',cookTime:30,servings:4,costPerServing:4.8,macros:{calories:480,protein:34,carbs:44,fat:18,fiber:2,sugar:4,sodium:560},tags:['Dinner','Easy'],image:'https://sweetpeasandsaffron.com/wp-content/uploads/2019/10/sheet-pan-gnocchi-3-600x600.jpg',ingredients:['1 lb gnocchi (shelf-stable or refrigerated)','1.5 lb chicken thighs, boneless','1 pint cherry tomatoes','1/2 cup chicken broth','3 tbsp olive oil','4 cloves garlic, minced','1 lemon, zested and juiced','1 tsp Italian seasoning','Salt and pepper','Fresh basil and Parmesan to serve'],instructions:['Preheat oven to 425°F.','Toss gnocchi, chicken thighs and cherry tomatoes with olive oil, garlic, Italian seasoning, salt and pepper in a large baking dish.','Pour broth around everything. Scatter lemon zest over top.','Roast 25–30 minutes until chicken is cooked through, gnocchi is golden in spots and tomatoes have burst.','Squeeze lemon juice over the dish right out of the oven.','Top with fresh basil and Parmesan and serve straight from the pan.'],timesMade:0,isEasy:true},
                {id:2131,collection:'alec-treffs',name:'Twix Stuffed Dates',prepTime:'10 min',cookTime:0,servings:12,costPerServing:1.00,macros:{calories:180,protein:4,carbs:28,fat:7,fiber:3,sugar:22,sodium:80},tags:['Sweets','Snack','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1648761104891-30LEMBW0MADDBY2CGHVE/twixdate2.jpg?format=750w',ingredients:['12 Medjool dates, pitted','1/4 cup almond flour','1/4 cup coconut flour','3 tbsp coconut oil, melted and cooled','2 tbsp raw honey','1/2 cup chocolate chips','Small dollop of coconut oil (for melting chocolate)','Flaky sea salt for finishing'],instructions:['Whisk together almond flour, coconut flour, melted coconut oil and honey until a dough forms.','Slice each date open lengthwise and stuff a small amount of the mixture inside.','Place stuffed dates on a parchment-lined tray and freeze for 20–30 minutes to firm up.','Melt chocolate chips with a small dollop of coconut oil in the microwave — 20 seconds, stir, then 20 more seconds.','Drizzle melted chocolate over each stuffed date.','Finish with a pinch of flaky sea salt.','Store in the fridge.'],timesMade:0,isEasy:true},
                {id:2132,collection:'alec-treffs',name:'Cordon Bleu Stuffed Chicken Tenders',prepTime:'20 min',cookTime:20,servings:4,costPerServing:5.00,macros:{calories:380,protein:42,carbs:12,fat:18,fiber:1,sugar:2,sodium:560},tags:['Snack','Dinner'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1612322509553-XVEV8AYIVW0UH0AI3JO0/cordonbleuchickentenders.JPG?format=750w',ingredients:['1 lb chicken tender pieces','1 egg, beaten','1/4 cup gluten-free flour (like Bob\'s Red Mill)','1/2 cup almond flour cracker crumbs (like Fat Snax)','Thin-sliced ham','Swiss cheese slices','Dipping sauce: 1/4 cup Greek yogurt, 2 tbsp Dijon mustard, 1 tbsp honey'],instructions:['Preheat oven to 400°F. Set up a breading station with flour, beaten egg, and cracker crumbs in separate bowls.','Place a small piece of ham and Swiss cheese at one end of each chicken tender. Roll the tender around the filling and secure with a toothpick if needed.','Dredge each stuffed tender in flour, dip in egg, then coat in cracker crumbs.','Place on a parchment-lined baking sheet and bake 18–20 minutes until golden and cooked through.','While tenders bake, whisk together Greek yogurt, Dijon and honey for the dipping sauce.','Serve hot with the honey Dijon dipping sauce.'],timesMade:0,isEasy:false},
                {id:2133,collection:'alec-treffs',name:'Crab Cream Cheese Quesadillas',prepTime:'10 min',cookTime:10,servings:4,costPerServing:4.50,macros:{calories:420,protein:22,carbs:30,fat:24,fiber:2,sugar:3,sodium:640},tags:['Snack','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1644268507946-KUUJ5MWF3D1BSBLZ154K/crabcreamcheesequesadilla.JPG?format=750w',ingredients:['8 small flatbreads or tortillas (5-inch)','8 oz real crab meat','4 oz cream cheese, softened','Salt and pepper to taste'],instructions:['Preheat oven to 400°F if using flatbreads — bake flatbreads first for a few minutes until lightly crisped.','Mix crab meat and cream cheese together in a bowl, using a 2:1 ratio of crab to cream cheese. Season lightly with salt and pepper.','Let flatbreads cool slightly, then spread the crab-cream cheese mixture on one half of each flatbread.','Fold each flatbread over to form a quesadilla.','Return to the oven for 5 more minutes until heated through and the edges are golden.','Slice and serve immediately.'],timesMade:0,isEasy:true},
                {id:2134,collection:'alec-treffs',name:'Whipped Cottage Cheese Ricotta Dip',prepTime:'10 min',cookTime:20,servings:6,costPerServing:2.00,macros:{calories:120,protein:10,carbs:8,fat:5,fiber:1,sugar:4,sodium:220},tags:['Snack','High-Protein','Vegetarian'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1643259155043-JPUW1EGMFSI38ULP6ALM/IMG_8028.JPG?format=750w',ingredients:['3/4 cup cottage cheese','3/4 cup ricotta cheese','1 tbsp olive oil','1 tbsp lemon juice','2 garlic cloves, minced','Toppings: cooked ground beef, pomegranate seeds, fresh parsley, drizzle of olive oil','Eggplant chips or sourdough toast points for dipping','For eggplant chips: 1 small eggplant thinly sliced, olive oil, Italian herbs, salt and pepper'],instructions:['Add cottage cheese, ricotta, olive oil, lemon juice and garlic to a blender. Blend until completely smooth and creamy.','Plate the dip in a wide shallow bowl.','Top with a drizzle of olive oil, cooked ground beef, pomegranate seeds and fresh parsley.','For eggplant chips: lay thin eggplant slices on a parchment-lined baking sheet. Brush with olive oil, season with Italian herbs, salt and pepper.','Bake eggplant at 425°F for 10 minutes, flip, then bake 10 more minutes until golden and crispy.','Serve dip with eggplant chips or sourdough toast points.'],timesMade:0,isEasy:true},
                {id:2135,collection:'alec-treffs',name:'White Chocolate PB Protein Balls',prepTime:'15 min',cookTime:0,servings:8,costPerServing:1.50,macros:{calories:160,protein:8,carbs:14,fat:9,fiber:1,sugar:9,sodium:70},tags:['Sweets','Snack','High-Protein','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1639960294425-5JE4TJ349RB3PR3V2XP8/whitechocolateproteinballs.JPG?format=750w',ingredients:['2/3 cup oat flour','1/2 scoop vanilla protein powder','1/4 cup peanut butter','1/4 cup unsweetened applesauce','1 tbsp honey','White chocolate chips (like Lily\'s no-sugar-added)','Small dollop of coconut oil (for melting chocolate)','Holiday sprinkles (optional)'],instructions:['Mix oat flour and protein powder together in one bowl.','In a separate bowl, combine peanut butter, applesauce and honey until smooth.','Add wet ingredients to dry and stir to combine. Fold in a handful of white chocolate chips.','Roll mixture into 8 balls and place on a parchment-lined tray. Freeze for 20 minutes to firm up.','Melt white chocolate chips with a small amount of coconut oil in the microwave — 20 seconds, stir, then 20 more seconds until smooth.','Dip each ball in the melted white chocolate, place back on parchment and add sprinkles if using.','Refrigerate for at least 30 minutes before eating. Store in the fridge.'],timesMade:0,isEasy:true},
                {id:2136,collection:'alec-treffs',name:'German Chocolate Cake Brownies',prepTime:'15 min',cookTime:30,servings:12,costPerServing:2.00,macros:{calories:290,protein:5,carbs:36,fat:14,fiber:3,sugar:22,sodium:180},tags:['Sweets','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1639760507334-UDD066IM6YMFB46YQNOZ/germanchocolate.jpg?format=750w',ingredients:['1 box brownie mix','1 can (15 oz) pumpkin purée','1 cup Medjool dates, pitted','1 cup full-fat coconut milk','Unsweetened coconut flakes','Raw pecans, chopped','Dark chocolate chips','Pinch of sea salt'],instructions:['Preheat oven to 350°F. Mix brownie mix and pumpkin purée together in a large bowl until combined — no oil or eggs needed.','Transfer batter to a parchment-lined 9" baking dish. Bake per box instructions (they will look slightly underdone — that\'s perfect).','Meanwhile, soak dates in warm water for at least 20 minutes.','Drain dates and blend with 1 cup coconut milk and a pinch of sea salt until smooth and caramel-like. Add more coconut milk or warm water if needed to reach your desired consistency.','Once brownies are baked, let cool completely. Spread the date caramel sauce over the top.','Sprinkle with coconut flakes, chopped pecans and dark chocolate chips.','Refrigerate at least 1 hour (preferably overnight) until set to a fudgy consistency.'],timesMade:0,isEasy:true},
                {id:2137,collection:'alec-treffs',name:'Applesauce Sugar Cookies',prepTime:'15 min',cookTime:10,servings:12,costPerServing:0.80,macros:{calories:120,protein:2,carbs:20,fat:4,fiber:1,sugar:10,sodium:90},tags:['Sweets','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1638978081289-RGF4VGJ1SH4JY8HSSDID/applesaucesugarcookies.JPG?format=750w',ingredients:['1.5 cups gluten-free flour (like Bob\'s Red Mill 1:1)','2/3 cup granulated monkfruit sweetener','1/2 cup unsweetened applesauce','1 egg','1 tsp vanilla extract','1/2 tsp baking powder','1/4 tsp salt','Vanilla frosting (Alec uses Simple Mills organic)','Sprinkles for decorating'],instructions:['Preheat oven to 350°F.','In one bowl, stir together applesauce and monkfruit sweetener. Add egg and vanilla, mix well.','In a separate bowl, whisk flour, baking powder and salt. Add dry ingredients to wet and stir until a dough forms.','Roll dough into tablespoon-sized balls and place on a parchment-lined baking sheet. Freeze dough balls for 20 minutes to firm up.','Remove from freezer, press each ball flat with a spatula.','Bake for 10 minutes. Let cool completely.','Frost each cookie and decorate with sprinkles.'],timesMade:0,isEasy:true},
                {id:2138,collection:'alec-treffs',name:'No Sugar Added Banana Walnut Muffins',prepTime:'15 min',cookTime:30,servings:12,costPerServing:1.00,macros:{calories:190,protein:5,carbs:28,fat:7,fiber:2,sugar:12,sodium:140},tags:['Breakfast','Snack','High-Protein'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1627604252353-UW77AHNDYOQ0C4G3X4R6/frosting.jpg?format=750w',ingredients:['1 cup ripe banana, mashed (about 2 bananas)','1/2 cup coconut flour','2 scoops vanilla protein powder','1 cup non-dairy milk (almond or coconut)','1/4 cup unsweetened applesauce','2 eggs','1 tsp vanilla extract','Pinch each of baking powder, baking soda and cinnamon','Walnuts, chopped','Optional protein frosting: 1/2 cup dairy-free cream cheese, 1/4 cup dairy-free plain yogurt, 1/2 scoop vanilla protein powder'],instructions:['Preheat oven to 350°F. Spray a muffin pan with coconut oil spray.','In a large bowl, mash bananas. Add eggs, almond milk, applesauce and vanilla, stir to combine.','Add coconut flour, protein powder, baking powder, baking soda and cinnamon. Mix until just combined.','Fold in walnuts.','Divide batter evenly into 12 muffin cups. Top with additional walnuts and a sprinkle of cinnamon.','Bake 30 minutes or until a toothpick comes out clean.','For protein frosting: beat cream cheese, yogurt and protein powder with a hand mixer until smooth. Refrigerate until muffins are fully cooled, then frost and sprinkle with cinnamon.'],timesMade:0,isEasy:true},
                {id:2139,collection:'alec-treffs',name:'4-Ingredient Mango Coconut Margarita',prepTime:'5 min',cookTime:0,servings:1,costPerServing:4.00,macros:{calories:160,protein:1,carbs:18,fat:0,fiber:0,sugar:14,sodium:30},tags:['Drinks','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1621541364737-ELUFAOV55EYFCCQEA4AR/mangomarg2.jpg?format=750w',ingredients:['Juice from 1.5 limes','1.5 shots coconut tequila (like 1800 Coconut)','8 oz coconut water','1/2 cup frozen mango','Crushed ice','Tajin for the rim (optional)'],instructions:['If using a Tajin rim, run a lime wedge around the edge of a short cocktail glass and dip in Tajin. Fill glass with crushed ice.','Add lime juice, coconut tequila, coconut water and frozen mango to a blender.','Blend until smooth.','Pour over the crushed ice in your prepared glass.','Serve immediately with a lime wedge.'],timesMade:0,isEasy:true},
                {id:2140,collection:'alec-treffs',name:'Roasted Cauliflower with Lentils & Tahini',prepTime:'15 min',cookTime:40,servings:4,costPerServing:3.50,macros:{calories:310,protein:12,carbs:32,fat:16,fiber:9,sugar:6,sodium:380},tags:['Dinner','Vegan','Healthy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1620246058661-5JW6QGGJLRKUN5V0TN35/cauliflowerlentil.JPG?format=750w',ingredients:['1 head cauliflower, cut into medium florets','1 onion, sliced into thin strips','1/2 cup cooked lentils (pre-cooked Trader Joe\'s work great)','1/4 cup pine nuts','Fresh parsley','Olive oil, salt and pepper','Lemon tahini sauce: 2 cloves garlic minced, 1 lemon juiced, 1/4 cup tahini, salt and pepper, warm water to thin'],instructions:['Add sliced onion to a pan with olive oil over low heat. Caramelize slowly for about 30 minutes, stirring every 5–10 minutes, until deep golden and sweet.','Spray cauliflower florets with olive oil, season with salt and pepper. Air fry at 400°F for 15 minutes, or roast in oven at 425°F for 40 minutes, tossing halfway.','Warm lentils in a separate pan over low heat with a little olive oil.','Whisk together minced garlic, lemon juice, tahini, salt and pepper. Slowly add warm water until you reach a drizzleable sauce consistency.','In the pan used for onions, toast pine nuts over low heat until golden, 2–3 minutes.','Toss cauliflower, caramelized onions and lentils together in a bowl. Drizzle generously with lemon tahini sauce and top with toasted pine nuts and fresh parsley.'],timesMade:0,isEasy:false},
                {id:2151,collection:'alec-treffs',name:'Cacio e Pepe Cauliflower Gnocchi',prepTime:'5 min',cookTime:15,servings:2,costPerServing:3.5,macros:{calories:350,protein:10,carbs:44,fat:14,fiber:4,sugar:3,sodium:490},tags:['Dinner','Vegetarian','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1613684872646-1OYU65CUEEUIW3ZNJ9WP/cacioepepe.JPG?format=500w',ingredients:['1 bag Trader Joe\'s cauliflower gnocchi','1/2 cup Pecorino Romano, finely grated','3 tbsp extra virgin olive oil','1/2 tsp freshly ground black pepper','Avocado oil spray'],instructions:['Spray avocado oil on your air fryer tray or basket.','Cook the cauliflower gnocchi in the air fryer at 375°F for 15 minutes, tossing occasionally, until crispy.','Meanwhile, combine Pecorino Romano, olive oil and black pepper in a mixing bowl and stir until it forms a paste-like texture.','When the gnocchi is done, immediately toss it into the bowl with the cheese mixture and coat thoroughly.','Serve right away while hot and crispy.'],timesMade:0,isEasy:true},
                {id:2152,collection:'alec-treffs',name:'Arugula Apple Fennel Salad',prepTime:'15 min',cookTime:5,servings:2,costPerServing:4.0,macros:{calories:340,protein:28,carbs:18,fat:18,fiber:4,sugar:10,sodium:280},tags:['Lunch','Healthy','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1611587248573-IXH7E4FOP9E3J634N438/fennelsalad.JPG?format=500w',ingredients:['4 cups arugula','1 bulb fennel, shaved thin','1 Honeycrisp apple, thinly sliced','1 cup rotisserie chicken, shredded','1/3 cup walnuts','1/4 cup Parmesan, shaved','Mustard vinaigrette: 2 tbsp olive oil, 1 tbsp white wine vinegar, 1 tbsp stone ground mustard, salt, pepper, splash of warm water'],instructions:['Add walnuts to a dry non-stick pan over low heat. Toss every minute or so for about 5 minutes until lightly toasted and fragrant. No oil needed. Set aside to cool.','Whisk together olive oil, white wine vinegar, mustard, salt and pepper. Add a splash of warm water to thin it out.','Build the salad: start with arugula, then add shaved fennel, apple slices and shredded chicken.','Top with toasted walnuts and shaved Parmesan.','Drizzle dressing over right before serving and toss gently.'],timesMade:0,isEasy:true},
                {id:2153,collection:'alec-treffs',name:'Turkey Sliders on Apple Buns',prepTime:'15 min',cookTime:10,servings:2,costPerServing:5.5,macros:{calories:310,protein:26,carbs:22,fat:12,fiber:3,sugar:8,sodium:520},tags:['Lunch','Healthy','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1611242389906-GQAS1KBYQ404TA534EZL/turkeyburger.JPG?format=500w',ingredients:['1/4 lb lean ground turkey (93% lean)','2 Honeycrisp apples','4 tbsp fig butter (Trader Joe\'s)','4 tbsp goat cheese','1 cup arugula','1/4 cup yellow onion, finely chopped','1 clove garlic, minced','1/2 tsp dried thyme','1/2 tbsp olive oil','1/2 lemon, juiced','Sea salt and pepper','Avocado oil for cooking'],instructions:['Mix ground turkey with onion, garlic, thyme, salt and pepper. Form into 4 small patties, roughly golf ball-sized.','Heat a cast iron skillet with a generous amount of avocado oil over medium-high heat. Cook patties through, about 3-4 minutes per side.','Toss arugula with olive oil, lemon juice, sea salt and pepper. Set aside.','Hold each apple upright and slice horizontally into 1/4-inch rounds. Pick the 8 most even slices.','Spread goat cheese on 4 apple slices and fig butter on the other 4.','Assemble: goat cheese slice on the bottom, turkey patty, dressed arugula, then the fig butter slice on top.','Serve immediately.'],timesMade:0,isEasy:true},
                {id:2154,collection:'alec-treffs',name:'Hummus Crusted Salmon',prepTime:'5 min',cookTime:10,servings:2,costPerServing:7.0,macros:{calories:340,protein:36,carbs:10,fat:16,fiber:3,sugar:2,sodium:430},tags:['Dinner','Healthy','Easy','Gluten-Free'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1611183243191-0HX7ZX89JCSEDZ9A3HCA/hummuscrustedsalmon.JPG?format=500w',ingredients:['2 salmon fillets (5-6 oz each)','1/3 cup hummus','1 tbsp olive oil','1/2 tsp dried oregano','1/4 tsp garlic powder','Sea salt and pepper'],instructions:['Pat salmon fillets dry with paper towels.','Coat each fillet with olive oil, then spread a generous layer of hummus over the top and sides.','Season with oregano, garlic powder, sea salt and pepper.','Air fry at 400°F for 10 minutes, or bake at 425°F for about 20 minutes, until salmon is cooked through and the hummus crust is golden.','Serve with cauliflower rice and a simple cucumber tomato feta salad if desired.'],timesMade:0,isEasy:true},
                {id:2155,collection:'alec-treffs',name:'Ranch Dip Chicken',prepTime:'35 min',cookTime:12,servings:4,costPerServing:4.5,macros:{calories:280,protein:38,carbs:3,fat:12,fiber:0,sugar:2,sodium:380},tags:['Dinner','Healthy','Easy','Gluten-Free'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1598635074090-5WF5BQVA9SQG3P87IIY5/ranchdipchicken.jpg?format=500w',ingredients:['4 organic chicken thighs','Olive oil','1/4 cup plain Greek yogurt','1/2 tsp onion powder','1/2 tsp dried parsley','1/4 tsp salt','1/4 tsp black pepper','1/4 tsp dried dill weed'],instructions:['Preheat air fryer to 370°F (or oven to 425°F).','Coat chicken thighs with olive oil.','Combine Greek yogurt, onion powder, parsley, salt, pepper and dill in a bowl and stir together.','Coat each chicken thigh with the yogurt mixture.','Let marinate for at least 30 minutes in the fridge.','Cook in the air fryer for 12 minutes, flipping halfway through, until cooked through (same timing works in the oven — check by cutting into the thickest part to confirm no pink).'],timesMade:0,isEasy:true},
                {id:2156,collection:'alec-treffs',name:'Lime Tahini Crispy Brussels Sprouts',prepTime:'10 min',cookTime:20,servings:2,costPerServing:3.0,macros:{calories:180,protein:5,carbs:18,fat:10,fiber:5,sugar:5,sodium:300},tags:['Side Dish','Vegetarian','Healthy','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1593040146673-WLAA5CPBHKFJ9T57QPGS/limetahinicrispybrusselsprouts.JPG?format=500w',ingredients:['1/2 lb Brussels sprouts','1 lime, juiced','2 tbsp tahini, plus more to finish','1 clove garlic, chopped','Avocado oil','Sea salt and pepper'],instructions:['Trim the bottoms of the Brussels sprouts and slice them in half.','In a bowl, mix together lime juice, tahini, sea salt and pepper to form the dressing.','Toss the halved Brussels sprouts in avocado oil, then coat with the lime tahini dressing. Add the chopped garlic and toss again.','Transfer to the air fryer basket and cook at 400°F for 20 minutes, tossing at the 10-minute and 15-minute marks.','Finish with an extra drizzle of tahini and serve hot.'],timesMade:0,isEasy:true},
                {id:2157,collection:'alec-treffs',name:'The Best Chicken Marinade',prepTime:'10 min',cookTime:25,servings:4,costPerServing:4.0,macros:{calories:280,protein:36,carbs:4,fat:12,fiber:0,sugar:2,sodium:420},tags:['Dinner','Healthy','Gluten-Free'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1586810154748-DK71DNDXPSH3KRRDKEXX/bestchickenmarinade.JPG?format=750w',ingredients:['1 lb chicken thighs','1/4 cup plain yogurt','1/4 cup spicy brown mustard','2 tbsp nutritional yeast','Sea salt and pepper','Avocado oil (for cooking)'],instructions:['Combine yogurt, mustard, nutritional yeast, sea salt and pepper in a bowl and mix well.','Add chicken thighs to a resealable bag and pour in the marinade. Seal and refrigerate at least 3 hours, or overnight.','Bring chicken to room temperature before cooking.','Heat a cast iron skillet with generous avocado oil over high heat. When warm (not smoking), place chicken skin-side down. Cook 2 minutes, then reduce to medium-high and cook skin-side down for 10–12 more minutes, occasionally moving the chicken.','Transfer skillet to a 400°F oven and cook 10 more minutes. Flip and cook 5 minutes longer until cooked through.','Transfer to a plate and rest 10 minutes before serving.'],timesMade:0,isEasy:false},
                {id:2158,collection:'alec-treffs',name:'Almond Parmesan Crusted Salmon',prepTime:'10 min',cookTime:20,servings:2,costPerServing:8.0,macros:{calories:360,protein:38,carbs:6,fat:20,fiber:2,sugar:1,sodium:390},tags:['Dinner','Healthy','Gluten-Free'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1586446918170-EIRLFMANMJG4IGV7J9QZ/almondparmesansalmon.JPG?format=750w',ingredients:['2 salmon fillets (4-6 oz each)','1/4 cup salted almonds','1/4 cup Parmesan, grated','1/4 egg white','Oil spray'],instructions:['Preheat oven to 425°F.','Pat salmon dry and set aside.','Add almonds to a food processor and pulse until they reach an almost flour-like consistency. Add grated Parmesan and pulse a few more times until the mixture just starts to bind together.','Set up two shallow bowls — one with egg white, one with the almond-Parmesan mixture.','Coat each salmon fillet in egg white, then press firmly into the almond-Parmesan mixture to crust all over.','Spray a baking sheet with oil spray. Lay the crusted salmon down and bake for 20 minutes until the crust is golden and salmon is cooked through.'],timesMade:0,isEasy:true},
                {id:2159,collection:'alec-treffs',name:'Mexican Roasted Cauliflower with Salsa Verde & Bacon',prepTime:'5 min',cookTime:30,servings:4,costPerServing:3.5,macros:{calories:160,protein:7,carbs:10,fat:10,fiber:3,sugar:4,sodium:560},tags:['Side Dish','Gluten-Free','Easy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1577080786624-DRFHBKLTLPIO8T74E5OO/Mexican+Roasted+Cauliflower+with+Salsa+Verde+and+Bacon.jpg?format=500w',ingredients:['1 head cauliflower, cut into florets','1 jar salsa verde (Trader Joe\'s recommended)','4 slices bacon','Taco seasoning','Avocado oil'],instructions:['Preheat oven to 425°F.','Toss cauliflower florets with avocado oil and sprinkle generously with taco seasoning.','Brush the cauliflower with salsa verde, then spread on a baking sheet.','Bake 25-30 minutes, tossing halfway through, until edges are caramelized and tender.','Meanwhile, chop the bacon and cook in a skillet until crispy. Drain on paper towels.','When the cauliflower is done, toss in a bowl with the crispy bacon and an extra spoonful of salsa verde.'],timesMade:0,isEasy:true},
                {id:2160,collection:'alec-treffs',name:'Roasted Cauliflower with Lentils & Lemon Tahini',prepTime:'15 min',cookTime:30,servings:4,costPerServing:4.0,macros:{calories:310,protein:12,carbs:32,fat:16,fiber:9,sugar:6,sodium:380},tags:['Dinner','Vegetarian','Healthy'],image:'https://images.squarespace-cdn.com/content/v1/5d8e9c8efaa25827a25c48c0/1620246058661-5JW6QGGJLRKUN5V0TN35/cauliflowerlentil.JPG?format=500w',ingredients:['1 head cauliflower, cut into medium florets','1 large onion, sliced into thin strips','1/2 cup cooked lentils (Trader Joe\'s pre-cooked works great)','1/4 cup pine nuts','Fresh parsley','Olive oil','Salt and pepper','Lemon tahini sauce: 2 garlic cloves minced, 1 lemon juiced, 1/4 cup tahini, salt and pepper, warm water to thin'],instructions:['Slice onion into thin strips and add to a pan with olive oil over low heat. Let caramelize for about 30 minutes, stirring every 5-10 minutes.','Warm the lentils in a separate small pan with a drizzle of olive oil over low heat.','Toss cauliflower florets with olive oil, salt and pepper. Air fry at 400°F for 15 minutes until crispy, or roast at 425°F for 40 minutes, tossing halfway.','Whisk together the lemon tahini sauce: minced garlic, lemon juice, tahini, salt and pepper. Slowly add warm water until you reach a drizzle-able consistency.','When everything is ready, toss the cauliflower, lentils and caramelized onions together in a bowl.','In the same onion pan over low heat, toast the pine nuts until evenly golden, 2-3 minutes.','Plate the cauliflower mix, drizzle generously with lemon tahini sauce and scatter with toasted pine nuts and fresh parsley.'],timesMade:0,isEasy:false},
                {id:2141,collection:'brocc-your-body',name:'Shrimp and Veggie Stir Fry',prepTime:'10 min',cookTime:15,servings:4,costPerServing:5.50,macros:{calories:280,protein:28,carbs:18,fat:10,fiber:4,sugar:6,sodium:680},tags:['Dinner','Healthy','Easy','Gluten-Free'],image:'https://broccyourbody.com/wp-content/uploads/2026/02/shrimp-stir-fry-e1772044912684.jpg',ingredients:['1 lb medium shrimp, peeled and deveined','1 yellow onion, sliced','1 bell pepper, sliced','1 cup sugar snap peas','1/4 cup roasted cashews','3 tbsp low-sodium soy sauce','1 tbsp honey','1 tbsp toasted sesame oil','2 cloves garlic, minced','1 tsp fresh ginger, grated','1 tbsp cornstarch','1 tbsp sriracha (optional)','2 tbsp oil','Green onions and sesame seeds to serve'],instructions:['Whisk together soy sauce, honey, sesame oil, garlic, ginger, cornstarch and sriracha for the sauce.','Heat oil in a large skillet or wok over high heat.','Add onion and peppers, stir fry 2-3 min.','Add snap peas, cook 1 min more.','Push veggies to the side, add shrimp and cook 1-2 min per side.','Pour sauce over everything and toss until glossy and thickened.','Top with cashews, green onions and sesame seeds. Serve with rice or noodles.'],timesMade:0,isEasy:true},
                {id:2142,collection:'brocc-your-body',name:'Crispy Chickpea Parmesan Kale Salad',prepTime:'15 min',cookTime:25,servings:4,costPerServing:3.50,macros:{calories:320,protein:14,carbs:30,fat:16,fiber:8,sugar:4,sodium:540},tags:['Lunch','Vegetarian','Healthy','Gluten-Free'],image:'https://broccyourbody.com/wp-content/uploads/2026/02/kale-salad-recipe.jpg',ingredients:['1 can chickpeas, drained and rinsed','1/2 cup freshly grated parmesan','1 tsp cornstarch','2 tbsp olive oil','1 large bunch kale, shredded','1/3 cup roasted almonds, roughly chopped','Lemon zest from 1 lemon','3 tbsp olive oil','2 tbsp red wine vinegar','1 small clove garlic, minced','1 tsp honey','Salt and pepper'],instructions:['Preheat oven to 400F. Dry chickpeas thoroughly with paper towels.','Toss chickpeas with 1 tbsp olive oil, cornstarch and a pinch of salt. Spread on a baking sheet.','Roast 20 min, then sprinkle parmesan on top. Roast 5 more min until cheese is melted and crispy.','Whisk together dressing: olive oil, vinegar, garlic, honey, salt and pepper.','Massage kale with a drizzle of olive oil and a pinch of salt until softened.','Toss kale with dressing, lemon zest and almonds.','Top with crispy chickpea parmesan croutons and serve immediately.'],timesMade:0,isEasy:true},
                {id:2143,collection:'brocc-your-body',name:'Cast Iron Filet Mignon with Red Wine Reduction',prepTime:'30 min',cookTime:15,servings:2,costPerServing:18.00,macros:{calories:450,protein:42,carbs:4,fat:28,fiber:1,sugar:2,sodium:390},tags:['Dinner'],image:'https://broccyourbody.com/wp-content/uploads/2026/02/filet_mignon.jpg',ingredients:['2 filet mignon steaks','Kosher salt and black pepper','Neutral cooking oil (avocado or similar)','2 tbsp salted butter, plus 1 tbsp for sauce','3 cloves garlic, smashed','2 sprigs fresh rosemary','1 shallot, finely minced','1/2 cup red wine (Cabernet recommended)','1/2 cup beef broth','1 tsp balsamic vinegar','Flaky salt to finish'],instructions:['Let steaks sit at room temperature 30-45 min before cooking. Pat completely dry and season generously with salt and pepper on all sides.','Heat a cast iron pan over medium-high heat. Add a drizzle of oil to coat.','Sear steaks undisturbed 2-3 min. Flip and cook 2 more min.','Reduce heat to medium. Add butter, garlic and rosemary. Tilt pan and baste steaks with butter until they reach desired temp (130F for medium rare). Remove steaks and rest on cutting board. Discard garlic and rosemary.','In the same pan, cook shallot over medium heat 2 min. Add wine and stir until reduced by half, about 3 min.','Add broth and balsamic. Reduce by half again, about 3 more min. Turn off heat and stir in 1 tbsp butter.','Slice steak against the grain, top with flaky salt and a generous pour of sauce.'],timesMade:0,isEasy:false},
                {id:2144,collection:'brocc-your-body',name:'Sheet Pan Mediterranean Salmon Bowls',prepTime:'15 min',cookTime:28,servings:4,costPerServing:8.00,macros:{calories:380,protein:34,carbs:22,fat:18,fiber:4,sugar:5,sodium:510},tags:['Dinner','Healthy','Gluten-Free','Easy'],image:'https://broccyourbody.com/wp-content/uploads/2026/01/IMG_1245-scaled.jpg',ingredients:['2 bell peppers, cut into bite-sized chunks','2 medium zucchini, cut into 1/2-inch half-moons','2 shallots, thinly sliced','1 cup cherry tomatoes, halved','4 6-oz salmon fillets','1/4 cup olive oil','2 tbsp fresh lemon juice','1 tsp dried oregano','1 tsp kosher salt','1/4 tsp black pepper','Cooked white or brown rice to serve','Tzatziki sauce','Crumbled feta cheese','Kalamata olives','Fresh dill'],instructions:['Preheat oven to 425F and line a sheet pan with parchment.','Whisk together olive oil, lemon juice, oregano, salt and pepper.','Add bell peppers, zucchini, shallots and cherry tomatoes to the pan. Pour 2/3 of the lemon sauce over veggies and toss to coat. Spread in an even layer.','Roast veggies 15 min until softened. Meanwhile, let salmon rest at room temp for 15 min.','Remove pan from oven. Arrange salmon on top of the veggies and drizzle with remaining lemon sauce.','Return to oven and roast 13-15 more min until salmon is cooked through and veggies are nicely browned.','Serve over rice topped with tzatziki, feta, olives and fresh dill.'],timesMade:0,isEasy:true},
                {id:2145,collection:'brocc-your-body',name:'Applesauce Brownies',prepTime:'10 min',cookTime:22,servings:9,costPerServing:1.50,macros:{calories:180,protein:3,carbs:28,fat:6,fiber:2,sugar:16,sodium:140},tags:['Sweets','Gluten-Free','Easy'],image:'https://broccyourbody.com/wp-content/uploads/2026/01/applesauce-brownies-new-feature.jpg',ingredients:['1/2 cup unsweetened applesauce','1/2 cup almond butter','1/3 cup cocoa powder','1/4 cup almond flour','1/4 cup coconut sugar or brown sugar','1 egg','1 tsp vanilla extract','1/2 tsp baking soda','1/2 cup bittersweet chocolate chips, divided'],instructions:['Preheat oven to 350F. Line an 8x8 baking dish with parchment.','Whisk together applesauce, almond butter, egg and vanilla until smooth.','Stir in cocoa powder, almond flour, sugar and baking soda until combined.','Fold in half the chocolate chips.','Pour into prepared pan and top with remaining chocolate chips.','Bake 20-22 min — center should still look slightly underdone.','Cool completely before slicing. They firm up as they cool.'],timesMade:0,isEasy:true},
                {id:2146,collection:'brocc-your-body',name:'Slow Cooker Mississippi Pot Roast',prepTime:'10 min',cookTime:480,servings:6,costPerServing:6.00,macros:{calories:420,protein:38,carbs:8,fat:26,fiber:1,sugar:4,sodium:820},tags:['Dinner'],image:'https://broccyourbody.com/wp-content/uploads/2026/01/mississippi-pot-roast-new-feature.jpg',ingredients:['3-4 lb chuck roast','1 lb baby yellow potatoes','3 large carrots, cut into chunks','1 packet ranch seasoning mix','1/2 cup pepperoncini, plus 2 tbsp juice from jar','1 cup beef broth','2 tbsp butter','1 tbsp dijon mustard','Salt and pepper'],instructions:['Season chuck roast generously with salt and pepper.','Place potatoes and carrots in the bottom of the slow cooker.','Place roast on top of the vegetables.','Sprinkle ranch seasoning over the roast. Add pepperoncini and juice.','Whisk together broth and mustard, pour around the roast. Add butter on top.','Cook on low 8-10 hours or high for 5-6 hours until meat is fall-apart tender.','Shred the meat with two forks and serve over the vegetables with the juices.'],timesMade:0,isEasy:true},
                {id:2147,collection:'brocc-your-body',name:'Creamy Tomato Tortellini Soup',prepTime:'10 min',cookTime:25,servings:4,costPerServing:5.50,macros:{calories:360,protein:14,carbs:38,fat:16,fiber:4,sugar:8,sodium:640},tags:['Dinner','Soup','Easy'],image:'https://broccyourbody.com/wp-content/uploads/2025/12/tortellini-soup-feature.jpg',ingredients:['1 lb raw Italian chicken sausage, casings removed','1 package refrigerated cheese tortellini','1 jar marinara sauce','2 cups chicken bone broth','1/2 cup heavy cream','2 cups fresh spinach','3 cloves garlic, minced','1 tsp Italian seasoning','Red pepper flakes, parmesan and fresh basil to serve'],instructions:['Cook sausage in a large pot over medium-high heat, breaking it up as it cooks, until no pink remains. Drain excess fat.','Add garlic and Italian seasoning, cook 1 min.','Add marinara and bone broth. Bring to a simmer.','Add tortellini and cook according to package directions.','Stir in heavy cream and spinach. Cook until spinach is wilted, 1-2 min.','Season to taste. Serve topped with parmesan, fresh basil and red pepper flakes.'],timesMade:0,isEasy:true},
                {id:2148,collection:'brocc-your-body',name:'Burger Bowls with Special Sauce',prepTime:'10 min',cookTime:15,servings:4,costPerServing:6.00,macros:{calories:440,protein:36,carbs:18,fat:24,fiber:3,sugar:6,sodium:580},tags:['Dinner','Easy'],image:'https://broccyourbody.com/wp-content/uploads/2025/12/IMG_0969-scaled.jpeg',ingredients:['1 lb 90% lean ground beef','1 yellow onion, diced','1 cup shredded cheddar cheese','1 bag frozen sweet potato fries','4-6 cups romaine lettuce, chopped','2 Roma tomatoes, diced','Pickles for serving','1 tbsp olive oil','Salt and pepper','1/3 cup mayonnaise','2 tbsp ketchup','2 tsp yellow mustard','2 tbsp finely chopped pickles','2 tsp pickle juice'],instructions:['Cook sweet potato fries according to package instructions.','Mix together special sauce: mayo, ketchup, mustard, chopped pickles and pickle juice. Set aside.','Heat olive oil in a large skillet over medium-high. Add onion and cook 7-8 min until golden.','Add ground beef and cook, breaking up, until no pink remains. Season with salt and pepper. Top with cheese, cover until melted.','Assemble bowls with romaine, fries, beef and tomatoes.','Drizzle generously with special sauce and top with pickles.'],timesMade:0,isEasy:true},
                {id:2149,collection:'brocc-your-body',name:'BBQ Cranberry Ginger Chicken Meatballs',prepTime:'15 min',cookTime:90,servings:10,costPerServing:3.50,macros:{calories:290,protein:26,carbs:22,fat:10,fiber:2,sugar:14,sodium:490},tags:['Appetizer','Healthy','Easy'],image:'https://broccyourbody.com/wp-content/uploads/2025/12/IMG_1130-scaled.jpg',ingredients:['2 lbs 93% lean ground chicken','1 1/3 cups panko breadcrumbs','2 eggs','2 cloves garlic, minced','1 tbsp fresh ginger, grated','1 1/2 tsp kosher salt','1/2 tsp black pepper','1 bottle (18 oz) barbecue sauce','1 jar (12 oz) cranberry sauce','2 tsp Worcestershire sauce','Orange zest, fresh thyme and flaky salt to finish'],instructions:['Preheat oven to 400F. Line a baking sheet with parchment.','Mix together chicken, panko, eggs, garlic, ginger, salt and pepper. Form into golf ball-sized meatballs.','Bake meatballs 15 min.','Meanwhile, stir together BBQ sauce, cranberry sauce and Worcestershire in a slow cooker.','Add baked meatballs to the slow cooker, toss to coat.','Cook on high 1-2 hours or low 2-3 hours until cooked through.','Serve topped with orange zest, fresh thyme and flaky salt.'],timesMade:0,isEasy:true},
                {id:2150,collection:'brocc-your-body',name:'Slow Cooker Soy Garlic Steak Noodles',prepTime:'10 min',cookTime:420,servings:4,costPerServing:7.00,macros:{calories:480,protein:32,carbs:44,fat:18,fiber:2,sugar:8,sodium:760},tags:['Dinner','Easy'],image:'https://broccyourbody.com/wp-content/uploads/2025/05/slow-cooker-soy-garlic-steak-noodles-24.jpeg',ingredients:['1.5 lbs flank steak, sliced into 2-inch pieces','1/2 cup reduced sodium soy sauce','2 cloves garlic, minced','1 tbsp fresh ginger, grated','1 tbsp rice vinegar','3 tbsp honey','1 tbsp toasted sesame oil','1 tbsp sriracha','1/4 cup + 1.5 cups water, divided','2 tbsp cornstarch','2 bell peppers, sliced','8 oz lo mein or ramen noodles','Green onions to serve'],instructions:['Whisk together soy sauce, garlic, ginger, rice vinegar, honey, sesame oil, sriracha and 1/4 cup water.','Add steak to slow cooker. Pour sauce over top. Cook on high 3-4 hours or low 6-7 hours until tender.','Whisk cornstarch into 1.5 cups water until smooth. Add to slow cooker with bell peppers. Stir to combine.','Add noodles. Cook, stirring every 5-10 min, for 20-25 min until noodles are cooked through.','Serve immediately topped with lots of sliced green onions.'],timesMade:0,isEasy:true},
              ];

              if (discoverRecipe) {
                const col = discoverCollections.find(c => c.id === discoverRecipe.collection);
                const isAdded = [...userRecipes, ...sampleRecipes].some(r => r.name === discoverRecipe.name);
                return (
                  <div>
                    <button onClick={() => setDiscoverRecipe(null)} style={{display:'flex',alignItems:'center',gap:'8px',background:'none',border:'none',cursor:'pointer',color:'#6a6050',fontSize:'14px',marginBottom:'16px',padding:0}}>← Back to {col?.name}</button>
                    <div style={{borderRadius:'16px',overflow:'hidden',border:'1px solid #e0d8cc',background:'#fefcf8'}}>
                      <div style={{height:'240px',backgroundImage:`url(${discoverRecipe.image})`,backgroundSize:'cover',backgroundPosition:'center',position:'relative'}}>
                        <div style={{position:'absolute',bottom:'12px',left:'12px',background:`${col?.color}cc`,color:'white',padding:'4px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:600}}>{col?.emoji} {col?.name}</div>
                      </div>
                      <div style={{padding:'20px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px',flexWrap:'wrap',gap:'12px'}}>
                          <h2 style={{margin:0,fontSize:'24px',fontWeight:700,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>{discoverRecipe.name}</h2>
                          <button onClick={async () => { if (!isAdded) { const newR={...discoverRecipe,id:Date.now(),source:'discover'}; if(guestMode){setSampleRecipes(p=>[...p,newR]);}else{setUserRecipes(p=>[...p,newR]); await supabase.from('user_recipes').insert({user_id:session.user.id, recipe:newR});} } }} style={{padding:'10px 18px',background:isAdded?'#e8f5e9':'#2d5a3d',color:isAdded?'#2d5a3d':'white',border:isAdded?'1px solid #c8e6c9':'none',borderRadius:'10px',cursor:isAdded?'default':'pointer',fontWeight:600,fontSize:'14px',whiteSpace:'nowrap'}}>{isAdded?'✓ In My Book':'+ Add to My Book'}</button>
                        </div>
                        <div style={{display:'flex',gap:'16px',marginBottom:'16px',flexWrap:'wrap'}}>
                          <span style={{fontSize:'13px',color:'#6a6050'}}>⏱ Prep: {discoverRecipe.prepTime}</span>
                          <span style={{fontSize:'13px',color:'#6a6050'}}>🔥 Cook: {discoverRecipe.cookTime} min</span>
                          <span style={{fontSize:'13px',color:'#6a6050'}}>👥 Serves: {discoverRecipe.servings}</span>
                          {discoverRecipe.costPerServing && <span style={{fontSize:'13px',color:'#6a6050'}}>💰 ~${discoverRecipe.costPerServing.toFixed(2)}/serving</span>}
                        </div>
                        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'20px'}}>{discoverRecipe.tags.map(t=><span key={t} style={{background:'#f0ebe3',color:'#6a6050',padding:'3px 10px',borderRadius:'20px',fontSize:'12px'}}>{t}</span>)}</div>
                        {discoverRecipe.macros && (() => {
                          const m = discoverRecipe.macros;
                          const bars = [
                            {label:'Protein',value:m.protein,max:80,unit:'g',color:'#4caf50'},
                            {label:'Carbs',value:m.carbs,max:120,unit:'g',color:'#2196f3'},
                            {label:'Fat',value:m.fat,max:70,unit:'g',color:'#ef5350'},
                            {label:'Fiber',value:m.fiber,max:30,unit:'g',color:'#ab47bc'},
                            {label:'Sugar',value:m.sugar,max:50,unit:'g',color:'#ffca28'},
                            {label:'Sodium',value:m.sodium,max:2300,unit:'mg',color:'#26c6da'},
                          ];
                          return (
                            <div style={{background:'#f8f5f0',borderRadius:'12px',padding:'16px',marginBottom:'20px'}}>
                              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'12px'}}>
                                <span style={{fontSize:'13px',fontWeight:700,letterSpacing:'0.06em',color:'#8a7e6e',textTransform:'uppercase'}}>Nutrition per serving</span>
                                <span style={{fontSize:'20px',fontWeight:700,color:'#1c2820'}}>{m.calories} <span style={{fontSize:'12px',fontWeight:400,color:'#a09080'}}>kcal</span></span>
                              </div>
                              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                                {bars.map(({label,value,max,unit,color})=>(
                                  <div key={label} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                                    <span style={{fontSize:'12px',color:'#8a7e6e',width:'48px',textAlign:'right',flexShrink:0}}>{label}</span>
                                    <div style={{flex:1,height:'8px',background:'#e8e2d8',borderRadius:'100px',overflow:'hidden'}}>
                                      <div style={{width:`${Math.min((value/max)*100,100)}%`,height:'100%',background:color,borderRadius:'100px'}}/>
                                    </div>
                                    <span style={{fontSize:'12px',fontWeight:600,color:'#1c2820',width:'44px',flexShrink:0}}>{value}<span style={{fontSize:'10px',fontWeight:400,color:'#a09080'}}>{unit}</span></span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'24px'}}>
                          <div><h4 style={{margin:'0 0 10px 0',fontSize:'16px',fontWeight:600,color:'#1c2820'}}>Ingredients</h4><ul style={{margin:0,padding:'0 0 0 18px',color:'#4a4035',fontSize:'14px',lineHeight:1.8}}>{discoverRecipe.ingredients.map((ing,i)=><li key={i}>{ing}</li>)}</ul></div>
                          <div><h4 style={{margin:'0 0 10px 0',fontSize:'16px',fontWeight:600,color:'#1c2820'}}>Instructions</h4><ol style={{margin:0,padding:'0 0 0 18px',color:'#4a4035',fontSize:'14px',lineHeight:1.8}}>{discoverRecipe.instructions.map((step,i)=><li key={i} style={{marginBottom:'6px'}}>{step}</li>)}</ol></div>
                        </div>
                        <div style={{marginTop:'20px',paddingTop:'16px',borderTop:'1px solid #e0d8cc'}}><p style={{margin:0,fontSize:'13px',color:'#9a9080'}}>Inspired by <a href={col?.website} target="_blank" rel="noopener noreferrer" style={{color:'#2d5a3d',textDecoration:'none',fontWeight:600}}>{col?.name} ↗</a> — visit their site for the original recipe.</p></div>
                      </div>
                    </div>
                  </div>
                );
              }
              if (discoverCollection) {
                const col = discoverCollections.find(c => c.id === discoverCollection);
                const colRecipes = allDiscoverRecipes.filter(r => r.collection === discoverCollection);
                return (
                  <div>
                    <button onClick={() => setDiscoverCollection(null)} style={{display:'flex',alignItems:'center',gap:'8px',background:'none',border:'none',cursor:'pointer',color:'#6a6050',fontSize:'14px',marginBottom:'16px',padding:0}}>← All Collections</button>
                    {(() => {
                      const allAdded = colRecipes.length > 0 && colRecipes.every(r => [...userRecipes,...sampleRecipes].some(x => x.name === r.name));
                      const someAdded = colRecipes.some(r => [...userRecipes,...sampleRecipes].some(x => x.name === r.name));
                      const remaining = colRecipes.filter(r => ![...userRecipes,...sampleRecipes].some(x => x.name === r.name));
                      return (
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                            <div style={{width:'44px',height:'44px',borderRadius:'12px',background:col?.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>{col?.emoji}</div>
                            <div><h2 style={{margin:'0 0 2px 0',fontSize:'22px',fontWeight:700,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>{col?.name}</h2><p style={{margin:0,fontSize:'13px',color:'#6a6050'}}>{col?.tagline}</p></div>
                          </div>
                          <button
                            disabled={allAdded}
                            onClick={async () => {
                              if (allAdded) return;
                              const toAdd = remaining.map(r => ({...r, id: Date.now() + Math.random(), source:'discover'}));
                              if (guestMode) {
                                setSampleRecipes(p => [...p, ...toAdd]);
                              } else {
                                setUserRecipes(p => [...p, ...toAdd]);
                                await Promise.all(toAdd.map(r => supabase.from('user_recipes').insert({user_id: session.user.id, recipe: r})));
                              }
                            }}
                            style={{
                              padding:'9px 18px',
                              background: allAdded ? '#f0ece4' : '#2d5a3d',
                              color: allAdded ? '#9a9080' : '#fff',
                              border: allAdded ? '1px solid #d8d0c4' : 'none',
                              borderRadius:'10px',
                              fontSize:'13px',
                              fontWeight:600,
                              cursor: allAdded ? 'default' : 'pointer',
                              whiteSpace:'nowrap',
                              transition:'all 0.15s',
                              fontFamily:"'Jost',sans-serif",
                            }}>
                            {allAdded ? `✓ All ${colRecipes.length} Added` : someAdded ? `+ Add Remaining (${remaining.length})` : `+ Add All ${colRecipes.length} Recipes`}
                          </button>
                        </div>
                      );
                    })()}
                    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fill,minmax(280px,1fr))',gap:'16px'}}>
                      {colRecipes.map(r => {
                        const isAdded = [...userRecipes,...sampleRecipes].some(x=>x.name===r.name);
                        return (
                          <div key={r.id} onClick={() => setDiscoverRecipe(r)} style={{background:'#fefcf8',borderRadius:'14px',overflow:'hidden',border:'1px solid #e0d8cc',cursor:'pointer',transition:'box-shadow 0.15s'}} onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)'} onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
                            <div style={{height:'160px',backgroundImage:`url(${r.image})`,backgroundSize:'cover',backgroundPosition:'center',position:'relative'}}>
                              {isAdded && <div style={{position:'absolute',top:'8px',right:'8px',background:'#2d5a3d',color:'white',padding:'3px 8px',borderRadius:'12px',fontSize:'11px',fontWeight:600}}>✓ In Book</div>}
                            </div>
                            <div style={{padding:'14px'}}>
                              <h3 style={{margin:'0 0 6px 0',fontSize:'15px',fontWeight:600,color:'#1c2820'}}>{r.name}</h3>
                              <div style={{display:'flex',gap:'12px',marginBottom:'8px'}}><span style={{fontSize:'12px',color:'#9a9080'}}>⏱ {r.cookTime<=30?'Quick':r.cookTime+' min'}</span><span style={{fontSize:'12px',color:'#9a9080'}}>👥 {r.servings}</span>{r.costPerServing&&<span style={{fontSize:'12px',color:'#9a9080'}}>💰 ${r.costPerServing.toFixed(2)}</span>}</div>
                              <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>{r.tags.slice(0,3).map(t=><span key={t} style={{background:'#f0ebe3',color:'#6a6050',padding:'2px 8px',borderRadius:'20px',fontSize:'11px'}}>{t}</span>)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {colRecipes.length === 0 && <div style={{textAlign:'center',padding:'40px',color:'#9a9080'}}>No recipes in this collection yet.</div>}
                    <div style={{marginTop:'20px',padding:'14px',background:'#f5f0e8',borderRadius:'10px',textAlign:'center'}}><p style={{margin:0,fontSize:'13px',color:'#6a6050'}}>Want more? Visit <a href={col?.website} target="_blank" rel="noopener noreferrer" style={{color:'#2d5a3d',textDecoration:'none',fontWeight:600}}>{col?.website?.replace('https://','').replace('www.','')} ↗</a></p></div>
                  </div>
                );
              }
              return (
                <div>
                  <h2 style={{fontSize:isMobile?'24px':'28px',fontWeight:600,color:'#1c2820',margin:'0 0 4px 0',fontFamily:"'Cormorant Garamond',serif"}}>Discover Recipes</h2>
                  <p style={{color:'#6a6050',margin:'0 0 24px 0',fontSize:'14px'}}>Recipes inspired by the creators we love — add them straight to your book.</p>
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(auto-fill,minmax(200px,1fr))',gap:'12px'}}>
                    {discoverCollections.map(col => {
                      const count = allDiscoverRecipes.filter(r=>r.collection===col.id).length;
                      return (
                        <div key={col.id} onClick={() => setDiscoverCollection(col.id)} style={{background:'#fefcf8',borderRadius:'14px',border:'1px solid #e0d8cc',padding:'16px',cursor:'pointer',transition:'all 0.15s'}} onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)';e.currentTarget.style.borderColor=col.color;}} onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor='#e0d8cc';}}>
                          <div style={{width:'40px',height:'40px',borderRadius:'10px',background:col.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',marginBottom:'10px'}}>{col.emoji}</div>
                          <div style={{fontWeight:600,fontSize:'14px',color:'#1c2820',marginBottom:'4px'}}>{col.name}</div>
                          <div style={{fontSize:'12px',color:'#9a9080',marginBottom:'8px',lineHeight:1.4}}>{col.tagline}</div>
                          <div style={{fontSize:'11px',color:col.color,fontWeight:600}}>{count} recipes →</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            {recipeBookTab === 'mybook' && (
            <div>
            {activeFolder === null ? (
              /* ── FOLDER GRID VIEW ── */
              <div>
                <div style={{marginBottom:'24px'}}>
                  <h2 style={{fontSize:isMobile?'26px':'30px',fontWeight:600,color:'#1c2820',margin:'0 0 8px 0',fontFamily:"'Cormorant Garamond',serif"}}>Recipe Book</h2>
                  <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>
                    <p style={{color:'#6a6050',margin:0}}>{allMyRecipes.length > 0 ? `${folders.length} folders • ${allMyRecipes.length} recipes` : 'No recipes yet — add your first one!'}</p>
                    <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                      <button onClick={() => setShowFolderModal(true)} style={{padding:'9px 14px',background:'#fefcf8',border:'1px solid #e0d8cc',borderRadius:'8px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontWeight:600,fontSize:'13px',color:'#1c2820',whiteSpace:'nowrap'}}>
                        <Plus size={15} /> New Folder
                      </button>
                      <button onClick={() => { setShowImportModal(true); setImportStep('url'); setImportUrl(''); setImportError(''); setImportedRecipe(null); setImportFolderIds([]); setImportMode('url'); setImportImageFile(null); setImportImagePreview(null); }} style={{padding:'9px 14px',background:'#fefcf8',border:'1px solid #e0d8cc',borderRadius:'8px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontWeight:600,fontSize:'13px',color:'#1c2820',whiteSpace:'nowrap'}}>
                        🔗 Import Recipe
                      </button>
                      <button onClick={() => setShowAddRecipeModal(true)} style={{padding:'9px 14px',background:'#fefcf8',border:'none',borderRadius:'8px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontWeight:600,fontSize:'13px',color:'#1c2820',whiteSpace:'nowrap'}}>
                        <Plus size={15} /> Add Recipe
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search bar */}
                <div style={{position:'relative',marginBottom:'24px'}}>
                  <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'#7a7060',pointerEvents:'none',fontSize:'16px'}}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={recipeSearch}
                    onChange={e => { setRecipeSearch(e.target.value); if (e.target.value) setActiveFolder('all'); }}
                    style={{width:'100%',padding:'11px 14px 11px 42px',background:'#fefcf8',border:'1px solid #e0d8cc',borderRadius:'10px',fontSize:'14px',color:'#1c2820',outline:'none',boxSizing:'border-box'}}
                  />
                  {recipeSearch && (
                    <button onClick={() => setRecipeSearch('')} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#7a7060',fontSize:'18px',lineHeight:1}}>×</button>
                  )}
                </div>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fill, minmax(280px, 1fr))',gap:'16px'}}>

                  {/* All Recipes special card */}
                  <div onClick={() => setActiveFolder('all')} style={{background:'#fefcf8',borderRadius:'16px',overflow:'hidden',border:'1px solid #e0d8cc',cursor:'pointer',transition:'border-color 0.15s'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr',height:'180px',gap:'2px'}}>
                      {allMyRecipes.slice(0,4).map((r,i) => (
                        <div key={i} style={{backgroundImage:`url(${r.image})`,backgroundSize:'cover',backgroundPosition:'center'}} />
                      ))}
                      {allMyRecipes.length < 4 && Array.from({length: 4 - allMyRecipes.length}).map((_,i) => (
                        <div key={i} style={{background:'#f0ece4'}} />
                      ))}
                    </div>
                    <div style={{padding:'14px'}}>
                      <p style={{margin:'0 0 2px 0',fontSize:'17px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>📚 All Recipes</p>
                      <p style={{margin:0,fontSize:'12px',color:'#6a6050'}}>{allMyRecipes.length} recipes</p>
                    </div>
                  </div>

                  {/* Folder cards */}
                  {folders.map(folder => {
                    const folderRecipes = folder.recipes.map(rid => allMyRecipes.find(r => r.id === rid)).filter(Boolean);
                    const folderThumbRecipes = folderRecipes.filter(r => r.image).slice(0, 4);
                    const emptySlots = 4 - folderThumbRecipes.length;
                    return (
                      <div key={folder.id} style={{background:'#fefcf8',borderRadius:'16px',overflow:'hidden',border:'1px solid #e0d8cc',cursor:'pointer',transition:'border-color 0.15s',position:'relative'}}
                        onClick={() => setActiveFolder(folder.id)}>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr',height:'180px',gap:'2px',position:'relative'}}>
                          {folderThumbRecipes.map((r,i) => (
                            <div key={i} style={{backgroundImage:`url(${r.image})`,backgroundSize:'cover',backgroundPosition:'center'}} />
                          ))}
                          {emptySlots > 0 && Array.from({length: emptySlots}).map((_,i) => (
                            <div key={i} style={{background:'#f0ece4',display:'flex',alignItems:'center',justifyContent:'center'}}>
                              {folderThumbRecipes.length === 0 && i === 1 && <span style={{fontSize:'32px',opacity:0.3}}>{folder.emoji}</span>}
                            </div>
                          ))}
                        </div>
                        <div style={{padding:'14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <div>
                            <p style={{margin:'0 0 2px 0',fontSize:'17px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>{folder.emoji} {folder.name}</p>
                            <p style={{margin:0,fontSize:'12px',color:'#6a6050'}}>{folderRecipes.length} {folderRecipes.length === 1 ? 'recipe' : 'recipes'}</p>
                          </div>
                          <button onClick={e => { e.stopPropagation(); setShowFolderOptionsMenu(showFolderOptionsMenu === folder.id ? null : folder.id); }}
                            style={{background:'#f0ece4',border:'none',borderRadius:'8px',width:'32px',height:'32px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#9a9080',fontSize:'18px',fontWeight:700,flexShrink:0}}>
                            ⋯
                          </button>
                        </div>
                        {/* Options dropdown */}
                        {showFolderOptionsMenu === folder.id && (
                          <div onClick={e => e.stopPropagation()} style={{position:'absolute',bottom:'60px',right:'14px',background:'#ece8e0',border:'1px solid #d8d0c4',borderRadius:'10px',padding:'6px',zIndex:100,minWidth:'140px',boxShadow:'0 4px 20px rgba(0,0,0,0.5)'}}>
                            <button onClick={() => { setEditFolderName(folder.name); setEditFolderEmoji(folder.emoji); setShowEditFolderModal(folder); setShowFolderOptionsMenu(null); }}
                              style={{width:'100%',padding:'9px 12px',background:'none',border:'none',borderRadius:'6px',cursor:'pointer',color:'#1c2820',fontSize:'13px',fontWeight:600,textAlign:'left',display:'flex',alignItems:'center',gap:'8px'}}>
                              ✏️ Edit
                            </button>
                            <button onClick={() => { setShowDeleteFolderConfirm(folder); setShowFolderOptionsMenu(null); }}
                              style={{width:'100%',padding:'9px 12px',background:'none',border:'none',borderRadius:'6px',cursor:'pointer',color:'#c46a3a',fontSize:'13px',fontWeight:600,textAlign:'left',display:'flex',alignItems:'center',gap:'8px'}}>
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            ) : (
              /* ── FOLDER DETAIL VIEW ── */
              <div>
                {/* Back button + header */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                    <button onClick={() => setActiveFolder(null)} style={{background:'#fefcf8',border:'1px solid #e0d8cc',borderRadius:'8px',width:'38px',height:'38px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'18px',color:'#1c2820'}}>
                      ←
                    </button>
                    <div>
                      <h2 style={{fontSize:isMobile?'20px':'26px',fontWeight:700,color:'#1c2820',margin:'0 0 2px 0'}}>
                        {activeFolder === 'all' ? '📚 All Recipes' : (() => { const f = folders.find(f => f.id === activeFolder); return f ? `${f.emoji} ${f.name}` : ''; })()}
                      </h2>
                      <p style={{margin:0,fontSize:'13px',color:'#6a6050'}}>
                        {activeFolder === 'all' ? allMyRecipes.length : (() => { const f = folders.find(f => f.id === activeFolder); return f ? f.recipes.map(rid => allMyRecipes.find(r => r.id === rid)).filter(Boolean).length : 0; })()} recipes
                      </p>
                    </div>
                  </div>
                  <button onClick={() => { setShowImportModal(true); setImportStep('url'); setImportUrl(''); setImportError(''); setImportedRecipe(null); setImportFolderIds([]); setImportMode('url'); setImportImageFile(null); setImportImagePreview(null); }} style={{padding:'10px 18px',background:'#fefcf8',border:'1px solid #e0d8cc',borderRadius:'8px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontWeight:600,fontSize:'13px',color:'#1c2820'}}>
                    🔗 Import Recipe
                  </button>
                  <button onClick={() => setShowAddRecipeModal(true)} style={{padding:'10px 18px',background:'#fefcf8',border:'none',borderRadius:'8px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',fontWeight:600,fontSize:'13px',color:'#1c2820'}}>
                    <Plus size={16} /> Add Recipe
                  </button>
                  <button onClick={() => setReorderMode(r => !r)} style={{padding:'10px 18px',background:reorderMode?'#1c2820':'#fefcf8',border:'1px solid #e0d8cc',borderRadius:'8px',cursor:'pointer',fontWeight:600,fontSize:'13px',color:reorderMode?'#f0ece4':'#1c2820'}}>
                    {reorderMode ? '✓ Done' : '⇅ Reorder'}
                  </button>
                </div>

                {/* Filter bar for all recipes view */}
                {activeFolder === 'all' && <FilterBar showTried />}

                {/* Reorder hint */}
                {reorderMode && (
                  <div style={{background:'#f0ece4',borderRadius:'8px',padding:'10px 14px',marginBottom:'16px',fontSize:'13px',color:'#6a6050',display:'flex',alignItems:'center',gap:'8px'}}>
                    ⇅ Drag recipes to reorder.{activeFolder !== 'all' && ' The first 4 with images set the folder cover photo.'}
                  </div>
                )}

                {/* Recipe grid */}
                {(() => {
                  const base = activeFolder === 'all'
                    ? filterRecipes(allMyRecipes)
                    : (() => { const f = folders.find(f => f.id === activeFolder); return f ? f.recipes.map(rid => allMyRecipes.find(r => r.id === rid)).filter(Boolean) : []; })();
                  const recipesToShow = recipeSearch.trim()
                    ? base.filter(r => r.name.toLowerCase().includes(recipeSearch.toLowerCase()) || (r.tags||[]).some(t => t.toLowerCase().includes(recipeSearch.toLowerCase())) || (r.ingredients||[]).some(i => i.toLowerCase().includes(recipeSearch.toLowerCase())))
                    : base;
                  return recipesToShow.length === 0 ? (
                    <div style={{textAlign:'center',padding:'60px',background:'#fefcf8',borderRadius:'12px',border:'2px dashed #262626'}}>
                      <p style={{fontSize:'36px',margin:'0 0 10px 0'}}>{recipeSearch ? '🔍' : '📭'}</p>
                      <p style={{color:'#9a9080',fontSize:'16px',fontWeight:600,margin:'0 0 6px 0'}}>{recipeSearch ? `No recipes match "${recipeSearch}"` : 'No recipes here yet'}</p>
                      <p style={{color:'#7a7060',fontSize:'13px',margin:0}}>{recipeSearch ? 'Try a different search term' : 'Save recipes to this folder using the bookmark button on any recipe card'}</p>
                    </div>
                  ) : (
                    <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fill, minmax(260px, 1fr))',gap:'18px'}}>
                      {recipesToShow.map(recipe => {
                        const isSelected = selectedRecipeIds.has(recipe.id);
                        const isUserRecipe = userRecipes.find(r => r.id === recipe.id);
                        let pressTimer = null;
                        return (
                          <div key={recipe.id}
                            draggable={reorderMode}
                            onDragStart={() => { dragItem.current = recipesToShow.indexOf(recipe); }}
                            onDragEnter={() => { dragOverItem.current = recipesToShow.indexOf(recipe); }}
                            onDragEnd={() => {
                              if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;
                              const fromId = recipesToShow[dragItem.current]?.id;
                              const toId = recipesToShow[dragOverItem.current]?.id;
                              if (!fromId || !toId) return;
                              if (activeFolder === 'all') {
                                // Reorder userRecipes directly
                                const newOrder = [...userRecipes];
                                const fromIdx = newOrder.findIndex(r => r.id === fromId);
                                const toIdx = newOrder.findIndex(r => r.id === toId);
                                if (fromIdx === -1 || toIdx === -1) return;
                                const [moved] = newOrder.splice(fromIdx, 1);
                                newOrder.splice(toIdx, 0, moved);
                                setUserRecipes(newOrder);
                                if (session?.user) supabase.from('user_recipes').upsert(newOrder.map((r, i) => ({ user_id: session.user.id, recipe: r, sort_order: i })), { onConflict: 'user_id,recipe->>id' });
                              } else {
                                const folder = folders.find(f => f.id === activeFolder);
                                if (!folder) return;
                                const newOrder = [...folder.recipes];
                                const fromIdx = newOrder.indexOf(fromId);
                                const toIdx = newOrder.indexOf(toId);
                                if (fromIdx === -1 || toIdx === -1) return;
                                newOrder.splice(fromIdx, 1);
                                newOrder.splice(toIdx, 0, fromId);
                                updateFolders(prev => prev.map(f => f.id === activeFolder ? {...f, recipes: newOrder} : f));
                              }
                              dragItem.current = null;
                              dragOverItem.current = null;
                            }}
                            onDragOver={e => e.preventDefault()}
                            style={{background:'#fefcf8',borderRadius:'12px',overflow:'hidden',border:`2px solid ${isSelected ? '#ff6b6b' : selectionMode ? '#333' : '#262626'}`,position:'relative',transition:'border-color 0.15s',transform:isSelected?'scale(0.97)':'scale(1)',cursor:reorderMode?'grab':'default',opacity:reorderMode?0.95:1}}
                            onMouseDown={() => { if (!selectionMode && isUserRecipe) { pressTimer = setTimeout(() => { setSelectionMode(true); setSelectedRecipeIds(new Set([recipe.id])); }, 500); } }}
                            onMouseUp={() => clearTimeout(pressTimer)}
                            onMouseLeave={() => clearTimeout(pressTimer)}
                            onTouchStart={() => { if (!selectionMode && isUserRecipe) { pressTimer = setTimeout(() => { setSelectionMode(true); setSelectedRecipeIds(new Set([recipe.id])); }, 500); } }}
                            onTouchEnd={() => clearTimeout(pressTimer)}
                          >
                            {/* Checkbox overlay in selection mode */}
                            {selectionMode && isUserRecipe && (
                              <div onClick={() => setSelectedRecipeIds(prev => { const n = new Set(prev); n.has(recipe.id) ? n.delete(recipe.id) : n.add(recipe.id); return n; })}
                                style={{position:'absolute',top:'10px',left:'10px',zIndex:10,width:'26px',height:'26px',borderRadius:'50%',background:isSelected?'#ff6b6b':'rgba(0,0,0,0.6)',border:`2px solid ${isSelected?'#ff6b6b':'#fff'}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',backdropFilter:'blur(4px)'}}>
                                {isSelected && <span style={{color:'white',fontSize:'14px',fontWeight:700}}>✓</span>}
                              </div>
                            )}
                            <div onClick={() => { if (selectionMode && isUserRecipe) { setSelectedRecipeIds(prev => { const n = new Set(prev); n.has(recipe.id) ? n.delete(recipe.id) : n.add(recipe.id); return n; }); } else if (!selectionMode) { setSelectedRecipe(recipe); } }} style={{cursor:'pointer'}}>
                              <div style={{height:'170px',position:'relative'}}>
                                {recipe.image
                                  ? <div style={{height:'170px',backgroundImage:`url(${recipe.image})`,backgroundSize:'cover',backgroundPosition:'center'}} />
                                  : <div style={{height:'170px',background:'#f0ece4',display:'flex',alignItems:'center',justifyContent:'center',padding:'12px'}}><p style={{margin:0,fontSize:'16px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',textAlign:'center',lineHeight:1.3}}>{recipe.name}</p></div>
                                }
                                {recipe.timesMade === 0 && !selectionMode && <div style={{position:'absolute',top:'10px',right:'10px',background:'#c46a3a',color:'#fff',padding:'3px 8px',borderRadius:'6px',fontSize:'11px',fontWeight:600,zIndex:2}}>Not Tried</div>}
                                {recipe.cookTime < 20 && <div style={{position:'absolute',top:'10px',left:'10px',background:'#5a9a6a',color:'#fff',padding:'3px 8px',borderRadius:'6px',fontSize:'11px',fontWeight:600,display:'flex',alignItems:'center',gap:'3px',zIndex:2}}><Clock size={11} /> Quick</div>}
                              </div>
                              <div style={{padding:'14px 14px 8px',opacity:selectionMode&&!isUserRecipe?0.4:1}}>
                                <h3 style={{margin:'0 0 4px 0',fontSize:'15px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>{recipe.name}</h3>
                                <RatingDisplay recipeId={recipe.id} compact />
                                <p style={{margin:'6px 0 3px 0',fontSize:'12px',color:'#9a9080'}}>{recipe.prepTime} • {recipe.servings} servings</p>
                                <p style={{margin:0,fontSize:'12px',color:'#6a6050'}}>Made {recipe.timesMade} times</p>
                              </div>
                            </div>
                            {!selectionMode && (
                              <div style={{padding:'8px 14px 14px',display:'flex',gap:'6px',flexWrap:'wrap'}}>
                                <button onClick={e => { e.stopPropagation(); setShowRatingModal(recipe); }} style={{flex:isMobile?'1 1 100%':'1 1 auto',padding:'7px',background:userRatings[recipe.id]?'#1a1a1a':'#262626',color:userRatings[recipe.id]?'#fbbf24':'#999',border:'1px solid #d8d0c4',borderRadius:'6px',fontSize:'11px',fontWeight:600,cursor:'pointer'}}>
                                  {userRatings[recipe.id] ? `★ ${userRatings[recipe.id].rating}` : '☆ Rate'}
                                </button>
                                <button onClick={e => { e.stopPropagation(); setShowSaveToFolderModal(recipe); }} style={{flex:isMobile?'1 1 48%':'1 1 auto',padding:'7px',background:'#fefcf8',color:'#1c2820',border:'1px solid #d8d0c4',borderRadius:'6px',fontSize:'11px',fontWeight:600,cursor:'pointer'}}>
                                  🗂 Folder
                                </button>
                                <button onClick={e => { e.stopPropagation(); setShowAddToCalendar(recipe); }} style={{flex:isMobile?'1 1 48%':'1 1 auto',padding:'7px',background:'#1c2820',color:'#f0ece4',border:'none',borderRadius:'6px',fontSize:'11px',fontWeight:600,cursor:'pointer'}}>
                                  📅 Cal
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
            )}
          </div>
        )}

        {/* SETTINGS */}

        {currentView === 'settings' && (
          <div>
            <h2 style={{fontSize:isMobile?'24px':'30px',fontWeight:700,color:'#1c2820',margin:'0 0 6px 0'}}>Settings</h2>
            <p style={{color:'#9a9080',margin:'0 0 24px 0'}}>Toggle which meals to plan each day</p>
            <div style={{background:'#fefcf8',borderRadius:'8px',padding:isMobile?'16px':'28px',border:'1px solid #e0d8cc'}}>
              <h3 style={{margin:'0 0 20px 0',fontSize:'20px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Weekly Meal Schedule</h3>
              <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
              <table style={{width:'100%',borderCollapse:'separate',borderSpacing:'0 8px',minWidth:isMobile?'320px':'auto'}}>
                <thead>
                  <tr>{['Day','Breakfast','Lunch','Dinner'].map(h => <th key={h} style={{padding:'6px 12px',textAlign:h==='Day'?'left':'center',fontWeight:700,color:'#1c2820',fontSize:'12px',textTransform:'uppercase',letterSpacing:'0.5px'}}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {daysOfWeek.map((day, di) => (
                    <tr key={day} style={{background:'#f0ece4'}}>
                      <td style={{padding:'12px 14px',fontWeight:600,color:'#1c2820',borderRadius:'8px 0 0 8px'}}>{day}</td>
                      {['breakfast','lunch','dinner'].map((mt, i) => (
                        <td key={mt} style={{padding:'12px 14px',textAlign:'center',borderRadius:i===2?'0 8px 8px 0':0}}>
                          <label style={{position:'relative',display:'inline-block',width:'44px',height:'24px',cursor:'pointer'}}>
                            <input type="checkbox" checked={mealTypeSettings[di][mt]} onChange={e => {
                              const on = e.target.checked;
                              setMealTypeSettings(p => ({...p,[di]:{...p[di],[mt]:on}}));
                              const key = `${di}-${mt}`;
                              if (!on) { setDisabledSlots(p => ({...p,[key]:true})); removeMealFromPlan(di, mt); }
                              else { setDisabledSlots(p => { const n={...p}; delete n[key]; return n; }); }
                            }} style={{opacity:0,width:0,height:0}} />
                            <span style={{position:'absolute',inset:0,background:mealTypeSettings[di][mt]?'#2d5a3d':'#c0392b',borderRadius:'12px',transition:'0.3s'}}>
                              <span style={{position:'absolute',height:'16px',width:'16px',left:mealTypeSettings[di][mt]?'24px':'4px',bottom:'4px',background:'#ffffff',borderRadius:'50%',transition:'0.3s'}} />
                            </span>
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              <div style={{marginTop:'20px',padding:'14px',background:'#f0ece4',borderRadius:'8px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontWeight:600,color:'#1c2820'}}>Total meals enabled</span>
                <span style={{fontSize:'22px',fontWeight:700,color:'#1c2820'}}>{Object.values(mealTypeSettings).reduce((t,d) => t+Object.values(d).filter(Boolean).length, 0)}</span>
              </div>
              <div style={{display:'flex',gap:'10px',marginTop:'16px',flexWrap:'wrap'}}>
                <button onClick={() => { const s={}; for(let i=0;i<7;i++) s[i]={breakfast:true,lunch:true,dinner:true}; setMealTypeSettings(s); setDisabledSlots({}); }}
                  style={{flex:isMobile?'1 1 auto':undefined,padding:'10px 18px',background:'#fefcf8',border:'none',borderRadius:'8px',fontWeight:600,cursor:'pointer',color:'#1c2820'}}>Enable All</button>
                <button onClick={() => {
                  const s={}, ds={};
                  for(let i=0;i<7;i++) { const wd=i>0&&i<6; s[i]={breakfast:wd,lunch:wd,dinner:wd}; if(!wd){ds[`${i}-breakfast`]=true;ds[`${i}-lunch`]=true;ds[`${i}-dinner`]=true;} }
                  setMealTypeSettings(s); setDisabledSlots(ds);
                }} style={{flex:isMobile?'1 1 auto':undefined,padding:'10px 18px',background:'#f0ece4',border:'1px solid #d8d0c4',borderRadius:'8px',fontWeight:600,cursor:'pointer',color:'#1c2820'}}>Weekdays Only</button>
              </div>
            </div>


          </div>
        )}
      </div>


      {/* FOLLOWING / FOLLOWERS MODAL */}
      {showFollowModal && (
        <div onClick={() => setShowFollowModal(null)} style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.9)',display:'flex',alignItems:'flex-start',justifyContent:'center',zIndex:1002,padding:'20px',paddingTop:'60px'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fefcf8',borderRadius:'16px',width:'100%',maxWidth:'420px',overflow:'hidden',border:'1px solid #e0d8cc'}}>
            {/* Header with tabs */}
            <div style={{display:'flex',borderBottom:'1px solid #e0d8cc'}}>
              {['following','followers'].map(tab => (
                <button key={tab} onClick={() => setShowFollowModal(tab)}
                  style={{flex:1,padding:'16px',background:'none',border:'none',borderBottom:`2px solid ${showFollowModal===tab?'#1c2820':'transparent'}`,cursor:'pointer',fontWeight:showFollowModal===tab?700:400,fontSize:'14px',color:showFollowModal===tab?'#1c2820':'#9a9080',textTransform:'capitalize'}}>
                  {tab === 'following' ? `Following (${follows.size})` : `Followers (${followers.length})`}
                </button>
              ))}
              <button onClick={() => setShowFollowModal(null)} style={{padding:'16px',background:'none',border:'none',cursor:'pointer'}}><X size={18} color="#999" /></button>
            </div>
            {/* List */}
            <div style={{maxHeight:'420px',overflowY:'auto',padding:'8px 0'}}>
              {(showFollowModal === 'following' ? followingList : followers).length === 0 ? (
                <p style={{textAlign:'center',color:'#9a9080',padding:'40px 20px',fontSize:'14px'}}>
                  {showFollowModal === 'following' ? 'You aren\'t following anyone yet.' : 'No one is following you yet.'}
                </p>
              ) : (showFollowModal === 'following' ? followingList : followers).map(person => (
                <div key={person.user_id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 20px'}}>
                  <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'#e0d8cc',flexShrink:0,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>
                    {person.avatar_url ? <img src={person.avatar_url} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : '👤'}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,color:'#1c2820',fontSize:'14px'}}>{person.username || 'Unknown'}</div>
                  </div>
                  {showFollowModal === 'following' && (
                    <button onClick={() => { toggleFollow(person.user_id); setFollowingList(prev => prev.filter(p => p.user_id !== person.user_id)); }}
                      style={{padding:'7px 14px',borderRadius:'8px',border:'1px solid #d8d0c4',background:'#f0ece4',fontWeight:600,fontSize:'12px',cursor:'pointer',color:'#6a6050'}}>
                      Unfollow
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FIND PEOPLE MODAL */}
      {showFindPeople && (
        <div onClick={() => { setShowFindPeople(false); setPeopleSearch(''); setPeopleResults([]); }} style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.9)',display:'flex',alignItems:'flex-start',justifyContent:'center',zIndex:1000,padding:'20px',paddingTop:'60px',overflowY:'auto'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fefcf8',borderRadius:'16px',padding:'24px',maxWidth:'480px',width:'100%',border:'1px solid #e0d8cc'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
              <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>👥 Find People</h2>
              <button onClick={() => { setShowFindPeople(false); setPeopleSearch(''); setPeopleResults([]); }} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
            </div>
            <div style={{position:'relative',marginBottom:'16px'}}>
              <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'#7a7060',fontSize:'16px'}}>🔍</span>
              <input
                autoFocus
                type="text"
                placeholder="Search by username or phone number..."
                value={peopleSearch}
                onChange={e => { setPeopleSearch(e.target.value); searchPeople(e.target.value); }}
                style={{width:'100%',padding:'12px 14px 12px 42px',background:'#f4f0ea',border:'1px solid #d8d0c4',borderRadius:'10px',fontSize:'14px',color:'#1c2820',outline:'none',boxSizing:'border-box'}}
              />
              {peopleSearch && <button onClick={() => { setPeopleSearch(''); setPeopleResults([]); }} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#7a7060',fontSize:'18px'}}>×</button>}
            </div>
            {searchingPeople && <p style={{color:'#6a6050',fontSize:'13px',textAlign:'center',padding:'20px 0'}}>Searching...</p>}
            {!searchingPeople && peopleSearch && peopleResults.length === 0 && (
              <p style={{color:'#6a6050',fontSize:'13px',textAlign:'center',padding:'20px 0'}}>No users found for "{peopleSearch}"</p>
            )}
            {!searchingPeople && peopleResults.length > 0 && (
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {peopleResults.map(person => (
                  <div key={person.user_id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'#f0ece4',borderRadius:'10px'}}>
                    <div onClick={() => { setViewingProfile(person); setShowFindPeople(false); }}
                      style={{width:'42px',height:'42px',borderRadius:'50%',background:'#fefcf8',overflow:'hidden',flexShrink:0,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>
                      {person.avatar_url ? <img src={person.avatar_url} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : '👤'}
                    </div>
                    <div style={{flex:1,minWidth:0}} onClick={() => { setViewingProfile(person); setShowFindPeople(false); }} style={{cursor:'pointer'}}>
                      <div style={{fontWeight:700,color:'#1c2820',fontSize:'14px'}}>{person.username}</div>
                      <div style={{fontSize:'12px',color:'#6a6050'}}>{person.recipe_count || 0} recipes · {person.follower_count || 0} followers</div>
                    </div>
                    <button onClick={() => toggleFollow(person.user_id)}
                      style={{padding:'8px 16px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:600,fontSize:'13px',flexShrink:0,
                      background: follows.has(person.user_id) ? '#262626' : '#fff',
                      color: follows.has(person.user_id) ? '#666' : '#000',
                      border: follows.has(person.user_id) ? '1px solid #333' : 'none'}}>
                      {follows.has(person.user_id) ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {!peopleSearch && (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:'32px',marginBottom:'8px'}}>👥</div>
                <p style={{color:'#6a6050',fontSize:'13px',margin:0}}>Search for friends by their username or phone number</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PUBLIC PROFILE VIEWER */}
      {viewingProfile && (
        <div onClick={() => setViewingProfile(null)} style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.9)',display:'flex',alignItems:'flex-start',justifyContent:'center',zIndex:1001,padding:'20px',paddingTop:'40px',overflowY:'auto'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fefcf8',borderRadius:'16px',maxWidth:'480px',width:'100%',border:'1px solid #e0d8cc',overflow:'hidden'}}>
            {/* Profile header */}
            <div style={{background:'linear-gradient(135deg, #1a1a2e, #262626)',padding:'28px 24px 20px',textAlign:'center',position:'relative'}}>
              <button onClick={() => setViewingProfile(null)} style={{position:'absolute',top:'14px',right:'14px',background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
              <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'#333',margin:'0 auto 12px',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px'}}>
                {viewingProfile.avatar_url ? <img src={viewingProfile.avatar_url} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : '👤'}
              </div>
              <h2 style={{margin:'0 0 4px',fontSize:'24px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>{viewingProfile.username}</h2>
              <div style={{display:'flex',justifyContent:'center',gap:'20px',margin:'12px 0 16px',fontSize:'13px',color:'#6a6050'}}>
                <span><strong style={{color:'#1c2820'}}>{viewingProfile.recipe_count || 0}</strong> recipes</span>
                <span><strong style={{color:'#1c2820'}}>{viewingProfile.follower_count || 0}</strong> followers</span>
              </div>
              {viewingProfile.user_id !== session?.user?.id && (
                <button onClick={() => toggleFollow(viewingProfile.user_id)}
                  style={{padding:'10px 32px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'14px',
                  background: follows.has(viewingProfile.user_id) ? '#262626' : '#fff',
                  color: follows.has(viewingProfile.user_id) ? '#999' : '#000',
                  border: follows.has(viewingProfile.user_id) ? '1px solid #333' : 'none'}}>
                  {follows.has(viewingProfile.user_id) ? '✓ Following' : '+ Follow'}
                </button>
              )}
            </div>
            {/* Their public recipes */}
            <div style={{padding:'20px 24px'}}>
              <h3 style={{margin:'0 0 14px',fontSize:'15px',fontWeight:700,color:'#1c2820'}}>Their Recipes</h3>
              <PublicUserRecipes userId={viewingProfile.user_id} onSelect={r => { setSelectedRecipe(r); setViewingProfile(null); }} />
            </div>
          </div>
        </div>
      )}

      {/* HOUSEHOLD MODAL */}
      {showHouseholdModal && (
        <div onClick={() => setShowHouseholdModal(false)} style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fefcf8',borderRadius:'16px',padding:'28px',maxWidth:'400px',width:'100%',border:'1px solid #e0d8cc'}}>
            {household ? (
              <>
                <div style={{textAlign:'center',marginBottom:'20px'}}>
                  <div style={{fontSize:'40px',marginBottom:'8px'}}>👨‍👩‍👧</div>
                  <h2 style={{margin:'0 0 6px 0',fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Household Created!</h2>
                  <p style={{margin:0,fontSize:'14px',color:'#6a6050'}}>Share the invite link with up to 3 more people</p>
                </div>
                <div style={{background:'#f0ece4',borderRadius:'10px',padding:'16px',marginBottom:'16px',textAlign:'center'}}>
                  <div style={{fontSize:'12px',color:'#6a6050',marginBottom:'6px'}}>Invite Code</div>
                  <div style={{fontSize:'28px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',letterSpacing:'6px'}}>{household.invite_code}</div>
                </div>
                <button onClick={async () => { await copyInviteLink(); }}
                  style={{width:'100%',padding:'12px',background:'#fefcf8',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700,fontSize:'14px',color:'#1c2820',marginBottom:'10px'}}>
                  {householdToast === 'copied' ? '✓ Link Copied!' : '🔗 Copy Invite Link'}
                </button>
                <button onClick={() => setShowHouseholdModal(false)}
                  style={{width:'100%',padding:'12px',background:'transparent',border:'1px solid #d8d0c4',borderRadius:'8px',cursor:'pointer',fontWeight:600,fontSize:'14px',color:'#9a9080'}}>
                  Done
                </button>
              </>
            ) : (
              <>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
                  <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Join a Household</h2>
                  <button onClick={() => setShowHouseholdModal(false)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
                </div>
                <p style={{margin:'0 0 16px 0',fontSize:'14px',color:'#6a6050'}}>Enter the 6-character invite code from your household member.</p>
                <input
                  id="join-code-input"
                  defaultValue={pendingJoinCode || ''}
                  placeholder="e.g. ABC123"
                  maxLength={6}
                  style={{width:'100%',padding:'14px',background:'#f4f0ea',border:'1px solid #d8d0c4',borderRadius:'8px',fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",textAlign:'center',letterSpacing:'4px',textTransform:'uppercase',boxSizing:'border-box',marginBottom:'8px',outline:'none'}}
                />
                {joiningHousehold === 'not_found' && <p style={{color:'#c46a3a',fontSize:'13px',margin:'0 0 8px 0'}}>Code not found. Check the code and try again.</p>}
                {joiningHousehold === 'full' && <p style={{color:'#c46a3a',fontSize:'13px',margin:'0 0 8px 0'}}>This household is full (max 4 members).</p>}
                {joiningHousehold === 'already_member' && <p style={{color:'#b06a10',fontSize:'13px',margin:'0 0 8px 0'}}>You're already in this household!</p>}
                {joiningHousehold === 'success' && <p style={{color:'#5a9a6a',fontSize:'13px',margin:'0 0 8px 0'}}>✓ Joined! Your meal plan and recipes are now shared.</p>}
                <div style={{display:'flex',gap:'10px',marginTop:'8px'}}>
                  <button onClick={() => setShowHouseholdModal(false)} style={{flex:1,padding:'12px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820',fontSize:'14px'}}>Cancel</button>
                  <button onClick={async () => {
                    const code = document.getElementById('join-code-input').value;
                    if (!code.trim()) return;
                    setJoiningHousehold('loading');
                    const result = await joinHousehold(code);
                    setJoiningHousehold(result);
                    if (result === 'success') {
                      setTimeout(() => { setShowHouseholdModal(false); setJoiningHousehold(false); window.history.replaceState({}, '', window.location.pathname); }, 2000);
                    }
                  }} style={{flex:2,padding:'12px',background:'#fefcf8',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700,color:'#1c2820',fontSize:'14px'}}>
                    {joiningHousehold === 'loading' ? 'Joining...' : 'Join Household →'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── EDIT FOLDER MODAL ── */}
      {showEditFolderModal && (
        <div onClick={() => setShowEditFolderModal(null)} style={{position:'fixed',inset:0,background:'rgba(15,22,16,0.92)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,padding:'20px'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fefcf8',borderRadius:'16px',padding:'24px',maxWidth:'420px',width:'100%',border:'1px solid #e0d8cc'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Edit Folder</h2>
              <button onClick={() => setShowEditFolderModal(null)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
            </div>
            <label style={{display:'block',marginBottom:'8px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Icon</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'10px'}}>
              {['🍽️','🥗','🍲','🥩','🐟','🥦','🧁','🍕','🌮','🥘','🍜','🥚','🥑','🍋','💪','⚡','🕯️','👶','🏠','📁'].map(e => (
                <button key={e} onClick={() => setEditFolderEmoji(e)}
                  style={{width:'40px',height:'40px',background:editFolderEmoji===e?'#fff':'#262626',border:editFolderEmoji===e?'2px solid #fff':'2px solid #333',borderRadius:'8px',cursor:'pointer',fontSize:'20px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {e}
                </button>
              ))}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
              <span style={{fontSize:'12px',color:'#6a6050',whiteSpace:'nowrap'}}>Or type your own:</span>
              <input type="text" maxLength={2} placeholder="✍️"
                value={['🍽️','🥗','🍲','🥩','🐟','🥦','🧁','🍕','🌮','🥘','🍜','🥚','🥑','🍋','💪','⚡','🕯️','👶','🏠','📁'].includes(editFolderEmoji) ? '' : editFolderEmoji}
                onChange={e => setEditFolderEmoji(e.target.value || editFolderEmoji)}
                onKeyDown={e => { if (e.key === 'Backspace' || e.key === 'Delete') setEditFolderEmoji('📁'); }}
                style={{width:'60px',padding:'8px',background:'#f4f0ea',border:'1px solid #d8d0c4',borderRadius:'8px',fontSize:'20px',color:'#1c2820',textAlign:'center',outline:'none',boxSizing:'border-box'}} />
            </div>
            <label style={{display:'block',marginBottom:'8px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Folder Name</label>
            <input type="text" value={editFolderName} onChange={e => setEditFolderName(e.target.value)}
              style={{width:'100%',padding:'11px 14px',border:'1px solid #d8d0c4',borderRadius:'8px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',outline:'none',boxSizing:'border-box',marginBottom:'20px'}} />
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={() => setShowEditFolderModal(null)} style={{flex:1,padding:'11px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820'}}>Cancel</button>
              <button disabled={!editFolderName.trim()} onClick={() => {
                updateFolders(prev => prev.map(f => f.id === showEditFolderModal.id ? {...f, name: editFolderName.trim(), emoji: editFolderEmoji} : f));
                setShowEditFolderModal(null);
              }} style={{flex:2,padding:'11px',background:editFolderName.trim()?'#fff':'#333',border:'none',borderRadius:'8px',cursor:editFolderName.trim()?'pointer':'not-allowed',fontWeight:700,color:editFolderName.trim()?'#000':'#666'}}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE FOLDER CONFIRM ── */}
      {showDeleteFolderConfirm && (
        <div onClick={() => setShowDeleteFolderConfirm(null)} style={{position:'fixed',inset:0,background:'rgba(15,22,16,0.92)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,padding:'20px'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fefcf8',borderRadius:'16px',padding:'24px',maxWidth:'380px',width:'100%',border:'1px solid #e0d8cc',textAlign:'center'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>🗑</div>
            <h2 style={{margin:'0 0 8px 0',fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Delete "{showDeleteFolderConfirm.name}"?</h2>
            <p style={{margin:'0 0 24px 0',fontSize:'14px',color:'#6a6050'}}>The folder will be deleted but your recipes will stay in your recipe book.</p>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={() => setShowDeleteFolderConfirm(null)} style={{flex:1,padding:'12px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820'}}>Cancel</button>
              <button onClick={() => {
                updateFolders(prev => prev.filter(f => f.id !== showDeleteFolderConfirm.id));
                if (activeFolder === showDeleteFolderConfirm.id) setActiveFolder(null);
                setShowDeleteFolderConfirm(null);
              }} style={{flex:1,padding:'12px',background:'#c0392b',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700,color:'#1c2820'}}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ONBOARDING MODAL ── */}
      {showOnboarding && session?.user && (
        <div style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.95)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9000,padding:'20px',overflowY:'auto'}}>
          <div style={{background:'#fefcf8',borderRadius:'20px',maxWidth:'460px',width:'100%',border:'1px solid #e0d8cc',overflow:'hidden'}}>

            {/* Progress bar */}
            <div style={{height:'3px',background:'#f0ece4'}}>
              <div style={{height:'100%',background:'#fefcf8',width:`${(onboardingStep/6)*100}%`,transition:'width 0.3s ease'}} />
            </div>

            <div style={{padding:'32px 28px'}}>

              {/* STEP 1 — Welcome */}
              {onboardingStep === 1 && (
                <div style={{textAlign:'center'}}>
                  <img src="/logo.png" alt="Logo" style={{width:'80px',height:'80px',objectFit:'contain',marginBottom:'20px'}} />
                  <h1 style={{fontSize:'28px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',margin:'0 0 10px 0'}}>Welcome to Recipe Roulette!</h1>
                  <p style={{fontSize:'15px',color:'#6a6050',margin:'0 0 32px 0',lineHeight:1.6}}>Let's get your account set up in just a few steps so we can personalize your experience.</p>
                  <button onClick={() => setOnboardingStep(2)}
                    style={{width:'100%',padding:'14px',background:'#fefcf8',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'16px',color:'#1c2820',cursor:'pointer'}}>
                    Let's Go →
                  </button>
                  <button onClick={async () => {
                    await supabase.from('profiles').upsert({ id: session.user.id, onboarding_complete: true }, { onConflict: 'id' });
                    setShowOnboarding(false);
                  }} style={{marginTop:'12px',background:'none',border:'none',cursor:'pointer',color:'#8a8070',fontSize:'13px',textDecoration:'underline'}}>
                    Skip for now
                  </button>
                </div>
              )}

              {/* STEP 2 — Name + Avatar */}
              {onboardingStep === 2 && (
                <div>
                  <p style={{fontSize:'12px',color:'#6a6050',margin:'0 0 4px 0',textTransform:'uppercase',letterSpacing:'1px',fontWeight:600}}>Step 1 of 4</p>
                  <h2 style={{fontSize:'24px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",margin:'0 0 6px 0'}}>What's your name?</h2>
                  <p style={{fontSize:'14px',color:'#6a6050',margin:'0 0 24px 0'}}>This is how you'll appear to other users</p>

                  {/* Avatar picker */}
                  <div style={{display:'flex',justifyContent:'center',marginBottom:'20px'}}>
                    <label style={{cursor:'pointer',position:'relative'}}>
                      <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'#f0ece4',border:'2px dashed #444',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',fontSize:'32px'}}>
                        {profile.avatarPreview ? <img src={profile.avatarPreview} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : '📷'}
                      </div>
                      <div style={{position:'absolute',bottom:0,right:0,background:'#fefcf8',borderRadius:'50%',width:'24px',height:'24px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px'}}>✏️</div>
                      <input type="file" accept="image/*" style={{display:'none'}} onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => setProfile(p => ({...p, avatarPreview: ev.target.result}));
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="Your display name"
                    value={profile.displayName}
                    onChange={e => setProfile(p => ({...p, displayName: e.target.value}))}
                    style={{width:'100%',padding:'13px 14px',background:'#f0ece4',border:'1px solid #d8d0c4',borderRadius:'10px',fontSize:'15px',color:'#1c2820',outline:'none',boxSizing:'border-box',marginBottom:'12px'}}
                  />
                  <input
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={profile.phone}
                    onChange={e => setProfile(p => ({...p, phone: e.target.value}))}
                    style={{width:'100%',padding:'13px 14px',background:'#f0ece4',border:'1px solid #d8d0c4',borderRadius:'10px',fontSize:'15px',color:'#1c2820',outline:'none',boxSizing:'border-box',marginBottom:'6px'}}
                  />
                  <p style={{fontSize:'11px',color:'#7a7060',margin:'0 0 12px 0'}}>Phone lets friends find you in search</p>
                  <input
                    type="text"
                    placeholder="ZIP code (optional)"
                    value={profile.zipCode}
                    onChange={e => setProfile(p => ({...p, zipCode: e.target.value.replace(/\D/g,'').slice(0,5)}))}
                    style={{width:'100%',padding:'13px 14px',background:'#f0ece4',border:'1px solid #d8d0c4',borderRadius:'10px',fontSize:'15px',color:'#1c2820',outline:'none',boxSizing:'border-box',marginBottom:'6px'}}
                  />
                  <p style={{fontSize:'11px',color:'#7a7060',margin:'0 0 24px 0'}}>We use your ZIP to estimate accurate local grocery prices 🛒</p>

                  <div style={{display:'flex',gap:'10px'}}>
                    <button onClick={() => setOnboardingStep(1)} style={{flex:1,padding:'13px',background:'#f0ece4',border:'none',borderRadius:'10px',fontWeight:600,fontSize:'14px',color:'#1c2820',cursor:'pointer'}}>← Back</button>
                    <button onClick={() => setOnboardingStep(3)} disabled={!profile.displayName.trim()}
                      style={{flex:2,padding:'13px',background:profile.displayName.trim()?'#fff':'#333',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'14px',color:profile.displayName.trim()?'#000':'#666',cursor:profile.displayName.trim()?'pointer':'not-allowed'}}>
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 — Household size */}
              {onboardingStep === 3 && (
                <div>
                  <p style={{fontSize:'12px',color:'#6a6050',margin:'0 0 4px 0',textTransform:'uppercase',letterSpacing:'1px',fontWeight:600}}>Step 2 of 4</p>
                  <h2 style={{fontSize:'24px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",margin:'0 0 6px 0'}}>Who are you cooking for?</h2>
                  <p style={{fontSize:'14px',color:'#6a6050',margin:'0 0 24px 0'}}>We'll use this to scale ingredient quantities</p>

                  <div style={{display:'flex',gap:'12px',marginBottom:'24px'}}>
                    {[{key:'adults',label:'👩 Adults',min:1},{key:'children',label:'🧒 Children',min:0}].map(({key,label,min}) => (
                      <div key={key} style={{flex:1,background:'#f0ece4',border:'1px solid #e0d8cc',borderRadius:'12px',padding:'16px',textAlign:'center'}}>
                        <p style={{margin:'0 0 12px 0',fontSize:'12px',fontWeight:600,color:'#9a9080',textTransform:'uppercase',letterSpacing:'0.5px'}}>{label}</p>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'16px'}}>
                          <button onClick={() => setProfile(p => {const v=Math.max(min,p[key]-1);return{...p,[key]:v,householdSize:(key==='adults'?v:p.adults)+(key==='children'?v:p.children)};} )}
                            style={{width:'36px',height:'36px',borderRadius:'50%',background:'#f0ece4',border:'none',cursor:'pointer',color:'#1c2820',fontSize:'20px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                          <span style={{fontSize:'28px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',minWidth:'32px',textAlign:'center'}}>{profile[key]}</span>
                          <button onClick={() => setProfile(p => {const v=Math.min(10,p[key]+1);return{...p,[key]:v,householdSize:(key==='adults'?v:p.adults)+(key==='children'?v:p.children)};} )}
                            style={{width:'36px',height:'36px',borderRadius:'50%',background:'#f0ece4',border:'none',cursor:'pointer',color:'#1c2820',fontSize:'20px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{fontSize:'13px',color:'#7a7060',textAlign:'center',marginBottom:'24px'}}>
                    {profile.householdSize === 1 ? 'Just you 🧑' : `${profile.householdSize} people total 👨‍👩‍👧‍👦`}
                  </p>

                  <div style={{display:'flex',gap:'10px'}}>
                    <button onClick={() => setOnboardingStep(2)} style={{flex:1,padding:'13px',background:'#f0ece4',border:'none',borderRadius:'10px',fontWeight:600,fontSize:'14px',color:'#1c2820',cursor:'pointer'}}>← Back</button>
                    <button onClick={() => setOnboardingStep(4)} style={{flex:2,padding:'13px',background:'#fefcf8',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'14px',color:'#1c2820',cursor:'pointer'}}>Continue →</button>
                  </div>
                </div>
              )}

              {/* STEP 4 — Dietary prefs */}
              {onboardingStep === 4 && (
                <div>
                  <p style={{fontSize:'12px',color:'#6a6050',margin:'0 0 4px 0',textTransform:'uppercase',letterSpacing:'1px',fontWeight:600}}>Step 3 of 4</p>
                  <h2 style={{fontSize:'24px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",margin:'0 0 6px 0'}}>Any dietary preferences?</h2>
                  <p style={{fontSize:'14px',color:'#6a6050',margin:'0 0 20px 0'}}>Select all that apply — you can change these anytime</p>

                  <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'24px'}}>
                    {[
                      {id:'whole30',label:'💪 Whole30'},
                      {id:'vegetarian',label:'🥦 Vegetarian'},
                      {id:'vegan',label:'🌱 Vegan'},
                      {id:'gluten-free',label:'🌾 Gluten-Free'},
                      {id:'dairy-free',label:'🥛 Dairy-Free'},
                      {id:'keto',label:'🥩 Keto'},
                      {id:'paleo',label:'🍖 Paleo'},
                      {id:'nut-free',label:'🥜 Nut-Free'},
                      {id:'low-carb',label:'📉 Low-Carb'},
                      {id:'high-protein',label:'💪 High-Protein'},
                    ].map(pref => {
                      const active = profile.dietaryPrefs.includes(pref.id);
                      return (
                        <button key={pref.id} onClick={() => setProfile(p => ({...p, dietaryPrefs: active ? p.dietaryPrefs.filter(x=>x!==pref.id) : [...p.dietaryPrefs, pref.id]}))}
                          style={{padding:'9px 14px',borderRadius:'20px',border:`1px solid ${active?'#fff':'#333'}`,background:active?'#fff':'transparent',color:active?'#000':'#999',fontWeight:600,fontSize:'13px',cursor:'pointer'}}>
                          {pref.label}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{display:'flex',gap:'10px'}}>
                    <button onClick={() => setOnboardingStep(3)} style={{flex:1,padding:'13px',background:'#f0ece4',border:'none',borderRadius:'10px',fontWeight:600,fontSize:'14px',color:'#1c2820',cursor:'pointer'}}>← Back</button>
                    <button onClick={() => setOnboardingStep(5)} style={{flex:2,padding:'13px',background:'#fefcf8',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'14px',color:'#1c2820',cursor:'pointer'}}>Continue →</button>
                  </div>
                </div>
              )}

              {/* STEP 5 — Find people / invite */}
              {onboardingStep === 5 && (
                <div>
                  <p style={{fontSize:'12px',color:'#6a6050',margin:'0 0 4px 0',textTransform:'uppercase',letterSpacing:'1px',fontWeight:600}}>Step 4 of 4</p>
                  <h2 style={{fontSize:'24px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",margin:'0 0 6px 0'}}>Cook with someone?</h2>
                  <p style={{fontSize:'14px',color:'#6a6050',margin:'0 0 20px 0'}}>Invite a partner or roommate to share your meal plan</p>

                  <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'24px'}}>
                    <button onClick={async () => {
                      const hh = await createHousehold();
                      if (hh) {
                        const url = `${window.location.origin}${window.location.pathname}?join=${hh.invite_code}`;
                        await navigator.clipboard.writeText(url);
                        setHouseholdToast('copied');
                        setTimeout(() => setHouseholdToast(''), 2500);
                      }
                    }} style={{padding:'14px',background:'#fefcf8',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'14px',color:'#1c2820',cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:'12px'}}>
                      <span style={{fontSize:'24px'}}>👨‍👩‍👧</span>
                      <div>
                        <div>Create a Household</div>
                        <div style={{fontSize:'12px',color:'#6a6050',fontWeight:400,marginTop:'2px'}}>Get an invite link to share with up to 3 people</div>
                      </div>
                    </button>
                    <button onClick={() => { setShowOnboarding(false); setShowFindPeople(true); }}
                      style={{padding:'14px',background:'#fefcf8',border:'1px solid #d8d0c4',borderRadius:'10px',fontWeight:600,fontSize:'14px',color:'#1c2820',cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:'12px'}}>
                      <span style={{fontSize:'24px'}}>🔍</span>
                      <div>
                        <div>Find Friends</div>
                        <div style={{fontSize:'12px',color:'#6a6050',fontWeight:400,marginTop:'2px'}}>Search by username or phone number</div>
                      </div>
                    </button>
                  </div>
                  {householdToast === 'copied' && <p style={{color:'#5a9a6a',fontSize:'13px',textAlign:'center',marginBottom:'12px'}}>✓ Invite link copied to clipboard!</p>}

                  <div style={{display:'flex',gap:'10px'}}>
                    <button onClick={() => setOnboardingStep(4)} style={{flex:1,padding:'13px',background:'#f0ece4',border:'none',borderRadius:'10px',fontWeight:600,fontSize:'14px',color:'#1c2820',cursor:'pointer'}}>← Back</button>
                    <button onClick={() => setOnboardingStep(6)} style={{flex:2,padding:'13px',background:'#fefcf8',border:'1px solid #d8d0c4',borderRadius:'10px',fontWeight:600,fontSize:'14px',color:'#9a9080',cursor:'pointer'}}>Skip →</button>
                  </div>
                </div>
              )}

              {/* STEP 6 — All set! */}
              {onboardingStep === 6 && (
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:'60px',marginBottom:'16px'}}>🎉</div>
                  <h2 style={{fontSize:'26px',fontWeight:800,color:'#1c2820',margin:'0 0 10px 0'}}>You're all set!</h2>
                  <p style={{fontSize:'14px',color:'#6a6050',margin:'0 0 24px 0',lineHeight:1.6}}>
                    {profile.displayName ? `Welcome, ${profile.displayName}! ` : ''}Time to start planning some amazing meals.
                  </p>
                  <div style={{background:'#f0ece4',borderRadius:'12px',padding:'16px',marginBottom:'24px',textAlign:'left'}}>
                    {profile.displayName && <div style={{fontSize:'13px',color:'#9a9080',marginBottom:'6px'}}>✓ Name: <span style={{color:'#1c2820'}}>{profile.displayName}</span></div>}
                    <div style={{fontSize:'13px',color:'#9a9080',marginBottom:'6px'}}>✓ Household: <span style={{color:'#1c2820'}}>{profile.householdSize} {profile.householdSize === 1 ? 'person' : 'people'}</span></div>
                    {profile.dietaryPrefs.length > 0 && <div style={{fontSize:'13px',color:'#9a9080'}}>✓ Diet: <span style={{color:'#1c2820'}}>{profile.dietaryPrefs.join(', ')}</span></div>}
                  </div>
                  <button onClick={async () => {
                    // Save everything to Supabase
                    await supabase.from('profiles').upsert({
                      id: session.user.id,
                      display_name: profile.displayName,
                      phone: profile.phone,
                      zip_code: profile.zipCode,
                      avatar_url: profile.avatarPreview,
                      dietary_prefs: profile.dietaryPrefs,
                      household_size: profile.householdSize,
                      adults: profile.adults,
                      children: profile.children,
                      onboarding_complete: true,
                      updated_at: new Date().toISOString()
                    }, { onConflict: 'id' });
                    // Update public profile
                    if (profile.displayName) {
                      await supabase.from('user_profiles_public').upsert({
                        user_id: session.user.id,
                        username: profile.displayName,
                        phone: profile.phone,
                        avatar_url: profile.avatarPreview,
                      }, { onConflict: 'user_id' });
                    }
                    setShowOnboarding(false);
                  }} style={{width:'100%',padding:'14px',background:'#fefcf8',border:'none',borderRadius:'10px',fontWeight:700,fontSize:'16px',color:'#1c2820',cursor:'pointer'}}>
                    Let's Cook!
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ── RATING MODAL ── */}
      {showRatingModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{background:'#fefcf8',borderRadius:'16px',padding:'28px',maxWidth:'400px',width:'100%',border:'1px solid #e0d8cc',textAlign:'center'}}>
            <h2 style={{margin:'0 0 8px 0',fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Rate this recipe</h2>
            <p style={{margin:'0 0 20px 0',fontSize:'14px',color:'#6a6050',fontWeight:600}}>{showRatingModal.name}</p>
            
            {/* Current rating if exists */}
            {userRatings[showRatingModal.id] && (
              <p style={{margin:'0 0 16px 0',fontSize:'13px',color:'#5a9a6a'}}>
                ✓ You rated this {userRatings[showRatingModal.id].rating} stars
              </p>
            )}

            {/* Interactive stars */}
            <div style={{display:'flex',justifyContent:'center',marginBottom:'24px'}}>
              <StarRating rating={userRatings[showRatingModal.id]?.rating || 0} size={40} interactive onRate={(r) => saveRating(showRatingModal.id, r)} />
            </div>

            <p style={{margin:'0 0 20px 0',fontSize:'12px',color:'#7a7060'}}>Tap a star to rate</p>

            <button onClick={() => setShowRatingModal(null)}
              style={{width:'100%',padding:'11px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── PROFILE SLIDE-OUT PANEL ── */}
      {showProfilePanel && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setShowProfilePanel(false)}
            onTouchEnd={(e) => { e.preventDefault(); setShowProfilePanel(false); }}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:200,backdropFilter:'blur(2px)',cursor:'pointer'}} />

          {/* Panel */}
          <div style={{position:'fixed',top:0,right:0,bottom:0,width:isMobile?'100%':'380px',background:'#1c2820',borderLeft:'1px solid #262626',zIndex:201,display:'flex',flexDirection:'column',overflowY:'auto'}}>

            {/* Panel header */}
            <div style={{padding:'20px 24px',borderBottom:'1px solid #1e1e1e',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
              <h2 style={{margin:0,fontSize:'20px',fontWeight:600,color:'#fefcf8',fontFamily:"'Cormorant Garamond',serif"}}>Your Profile</h2>
              <button onClick={() => setShowProfilePanel(false)} style={{background:'#f0ece4',border:'1px solid #d8d0c4',borderRadius:'50%',cursor:'pointer',padding:'8px',display:'flex',alignItems:'center',justifyContent:'center'}}><X size={18} color="#1c2820" /></button>
            </div>

            <div style={{padding:'24px',flex:1,display:'flex',flexDirection:'column',gap:'28px'}}>

              {/* Avatar upload */}
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'14px'}}>
                <div style={{position:'relative'}}>
                  <div style={{width:'90px',height:'90px',borderRadius:'50%',overflow:'hidden',background:'#f0ece4',border:'3px solid #333',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {profile.avatarPreview
                      ? <img src={profile.avatarPreview} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                      : <span style={{fontSize:'32px',fontWeight:700,color:'#1c2820'}}>{(profile.displayName || session?.user?.email || 'G')?.charAt(0).toUpperCase()}</span>
                    }
                  </div>
                  <label style={{position:'absolute',bottom:0,right:0,width:'28px',height:'28px',background:'#ffffff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',border:'2px solid #111'}}>
                    <Camera size={13} color="#000" />
                    <input type="file" accept="image/*" style={{display:'none'}} onChange={e => {
                      const f = e.target.files[0];
                      if (f) { const r = new FileReader(); r.onloadend = () => setProfile(p => ({...p, avatarPreview: r.result})); r.readAsDataURL(f); }
                    }} />
                  </label>
                </div>
                <p style={{margin:0,fontSize:'12px',color:'#7a7060',textAlign:'center'}}>Tap the camera to change your photo</p>
                {/* Following / Followers summary */}
                <div style={{display:'flex',gap:'24px',marginTop:'4px'}}>
                  <button onClick={() => setShowFollowModal('following')} style={{background:'none',border:'none',cursor:'pointer',textAlign:'center',padding:0}}>
                    <div style={{fontSize:'18px',fontWeight:700,color:'#fefcf8'}}>{follows.size}</div>
                    <div style={{fontSize:'11px',color:'#7a7060',textTransform:'uppercase',letterSpacing:'0.5px'}}>Following</div>
                  </button>
                  <button onClick={() => setShowFollowModal('followers')} style={{background:'none',border:'none',cursor:'pointer',textAlign:'center',padding:0}}>
                    <div style={{fontSize:'18px',fontWeight:700,color:'#fefcf8'}}>{followers.length}</div>
                    <div style={{fontSize:'11px',color:'#7a7060',textTransform:'uppercase',letterSpacing:'0.5px'}}>Followers</div>
                  </button>
                </div>
              </div>

              {/* Display name */}
              <div>
                <label style={{display:'block',marginBottom:'8px',fontWeight:600,color:'#fefcf8',fontSize:'13px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Display Name</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={e => setProfile(p => ({...p, displayName: e.target.value}))}
                  placeholder={session?.user?.email?.split('@')[0]}
                  style={{width:'100%',padding:'11px 14px',border:'1px solid #d0c8bc',borderRadius:'8px',fontSize:'14px',background:'#fefcf8',color:'#1c2820',outline:'none',boxSizing:'border-box'}}
                />
                <p style={{margin:'6px 0 0 0',fontSize:'11px',color:'#7a7060'}}>This is how your name appears in the app</p>
              </div>

              {/* Email (read only) */}
              <div>
                <label style={{display:'block',marginBottom:'8px',fontWeight:600,color:'#fefcf8',fontSize:'13px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Email</label>
                <div style={{padding:'11px 14px',border:'1px solid #1e1e1e',borderRadius:'8px',fontSize:'14px',background:'#f0ece4',color:'#7a7060'}}>
                  {session?.user?.email}
                </div>
              </div>

              {/* Phone number */}
              <div>
                <label style={{display:'block',marginBottom:'8px',fontWeight:600,color:'#fefcf8',fontSize:'13px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => setProfile(p => ({...p, phone: e.target.value}))}
                  placeholder="e.g. 310-555-0123"
                  style={{width:'100%',padding:'11px 14px',border:'1px solid #d0c8bc',borderRadius:'8px',fontSize:'14px',background:'#fefcf8',color:'#1c2820',outline:'none',boxSizing:'border-box'}}
                />
                <p style={{margin:'6px 0 0 0',fontSize:'11px',color:'#7a7060'}}>Optional — lets friends find you by phone number</p>
              </div>

              {/* ZIP Code */}
              <div>
                <label style={{display:'block',marginBottom:'8px',fontWeight:600,color:'#fefcf8',fontSize:'13px',textTransform:'uppercase',letterSpacing:'0.5px'}}>ZIP Code</label>
                <input
                  type="text"
                  value={profile.zipCode}
                  onChange={e => setProfile(p => ({...p, zipCode: e.target.value.replace(/\D/g,'').slice(0,5)}))}
                  placeholder="e.g. 90210"
                  maxLength={5}
                  style={{width:'100%',padding:'11px 14px',border:'1px solid #d0c8bc',borderRadius:'8px',fontSize:'14px',background:'#fefcf8',color:'#1c2820',outline:'none',boxSizing:'border-box'}}
                />
                <p style={{margin:'6px 0 0 0',fontSize:'11px',color:'#7a7060'}}>Used to estimate local grocery prices for budget meal planning 🛒</p>
              </div>

              {/* Household size */}
              <div>
                <label style={{display:'block',marginBottom:'12px',fontWeight:600,color:'#fefcf8',fontSize:'13px',textTransform:'uppercase',letterSpacing:'0.5px'}}>
                  Household Size
                </label>
                <div style={{display:'flex',gap:'12px',marginBottom:'10px'}}>
                  {/* Adults */}
                  <div style={{flex:1,background:'#1c2820',border:'1px solid #e0d8cc',borderRadius:'10px',padding:'12px'}}>
                    <p style={{margin:'0 0 10px 0',fontSize:'12px',fontWeight:600,color:'#9a9080',textTransform:'uppercase',letterSpacing:'0.5px'}}>👩 Adults</p>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px'}}>
                      <button onClick={() => setProfile(p => ({...p, adults: Math.max(1, p.adults-1), householdSize: Math.max(1, p.adults-1) + p.children}))}
                        style={{width:'32px',height:'32px',borderRadius:'50%',background:'#f0ece4',border:'none',cursor:'pointer',color:'#1c2820',fontSize:'18px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>−</button>
                      <span style={{fontSize:'22px',fontWeight:700,color:'#fefcf8',minWidth:'24px',textAlign:'center'}}>{profile.adults}</span>
                      <button onClick={() => setProfile(p => ({...p, adults: Math.min(10, p.adults+1), householdSize: Math.min(10, p.adults+1) + p.children}))}
                        style={{width:'32px',height:'32px',borderRadius:'50%',background:'#f0ece4',border:'none',cursor:'pointer',color:'#1c2820',fontSize:'18px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>+</button>
                    </div>
                  </div>
                  {/* Children */}
                  <div style={{flex:1,background:'#1c2820',border:'1px solid #e0d8cc',borderRadius:'10px',padding:'12px'}}>
                    <p style={{margin:'0 0 10px 0',fontSize:'12px',fontWeight:600,color:'#9a9080',textTransform:'uppercase',letterSpacing:'0.5px'}}>🧒 Children</p>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px'}}>
                      <button onClick={() => setProfile(p => ({...p, children: Math.max(0, p.children-1), householdSize: p.adults + Math.max(0, p.children-1)}))}
                        style={{width:'32px',height:'32px',borderRadius:'50%',background:'#f0ece4',border:'none',cursor:'pointer',color:'#1c2820',fontSize:'18px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>−</button>
                      <span style={{fontSize:'22px',fontWeight:700,color:'#fefcf8',minWidth:'24px',textAlign:'center'}}>{profile.children}</span>
                      <button onClick={() => setProfile(p => ({...p, children: Math.min(10, p.children+1), householdSize: p.adults + Math.min(10, p.children+1)}))}
                        style={{width:'32px',height:'32px',borderRadius:'50%',background:'#f0ece4',border:'none',cursor:'pointer',color:'#1c2820',fontSize:'18px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>+</button>
                    </div>
                  </div>
                </div>
                <p style={{margin:'4px 0 0',fontSize:'12px',color:'#7a7060'}}>
                  {profile.householdSize === 1 ? 'Just you 🧑' : `${profile.householdSize} total (${profile.adults} adult${profile.adults !== 1 ? 's' : ''}${profile.children > 0 ? `, ${profile.children} child${profile.children !== 1 ? 'ren' : ''}` : ''}) 👨‍👩‍👧‍👦`}
                </p>
              </div>

              {/* Household Sync */}
              <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:'20px'}}>
                <label style={{display:'block',marginBottom:'14px',fontWeight:600,color:'#fefcf8',fontSize:'13px',textTransform:'uppercase',letterSpacing:'0.5px'}}>
                  Family Sharing
                </label>
                {household ? (
                  <div style={{background:'rgba(90,154,106,0.12)',border:'1px solid rgba(90,154,106,0.3)',borderRadius:'14px',padding:'16px'}}>
                    {/* Active header */}
                    <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'14px'}}>
                      <div style={{width:'42px',height:'42px',borderRadius:'12px',background:'rgba(90,154,106,0.2)',border:'1px solid rgba(90,154,106,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flexShrink:0}}>
                        🏠
                      </div>
                      <div>
                        <div style={{fontSize:'14px',fontWeight:700,color:'#fefcf8',lineHeight:1.2}}>Active Household</div>
                        <div style={{fontSize:'12px',color:'#5a9a6a',marginTop:'2px'}}>{householdMembers.length} of 4 members joined</div>
                      </div>
                      <div style={{marginLeft:'auto',display:'flex',gap:'4px'}}>
                        {Array.from({length:4}).map((_,i) => (
                          <div key={i} style={{width:'10px',height:'10px',borderRadius:'50%',background: i < householdMembers.length ? '#5a9a6a' : 'rgba(255,255,255,0.15)'}} />
                        ))}
                      </div>
                    </div>
                    {/* Invite code */}
                    <div style={{background:'rgba(0,0,0,0.2)',borderRadius:'8px',padding:'10px 12px',marginBottom:'12px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div>
                        <div style={{fontSize:'10px',color:'#9a9080',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'3px'}}>Invite Code</div>
                        <div style={{fontSize:'16px',fontWeight:700,color:'#fefcf8',letterSpacing:'4px'}}>{household.invite_code}</div>
                      </div>
                      <button onClick={copyInviteLink} style={{padding:'8px 12px',background: householdToast === 'copied' ? 'rgba(90,154,106,0.3)' : 'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',cursor:'pointer',fontWeight:600,fontSize:'12px',color: householdToast === 'copied' ? '#5a9a6a' : '#fefcf8',transition:'all 0.2s',whiteSpace:'nowrap'}}>
                        {householdToast === 'copied' ? '✓ Copied!' : '🔗 Copy Link'}
                      </button>
                    </div>
                    <button onClick={async () => { if (window.confirm('Leave this household?')) await leaveHousehold(); }}
                      style={{width:'100%',padding:'9px',background:'transparent',border:'1px solid rgba(196,106,58,0.4)',borderRadius:'8px',cursor:'pointer',fontWeight:600,fontSize:'13px',color:'#c46a3a'}}>
                      Leave Household
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Promo card */}
                    <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',padding:'16px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'14px'}}>
                      <div style={{width:'48px',height:'48px',borderRadius:'12px',background:'rgba(196,106,58,0.15)',border:'1px solid rgba(196,106,58,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:0}}>
                        👨‍👩‍👧
                      </div>
                      <div>
                        <div style={{fontSize:'14px',fontWeight:600,color:'#fefcf8',marginBottom:'3px'}}>Plan meals together</div>
                        <div style={{fontSize:'12px',color:'#9a9080',lineHeight:1.4}}>Share your meal plan and recipes with up to 4 people in your home.</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'10px'}}>
                      <button onClick={async () => { await createHousehold(); setShowHouseholdModal(true); }}
                        style={{flex:1,padding:'11px',background:'#5a9a6a',border:'none',borderRadius:'10px',cursor:'pointer',fontWeight:700,fontSize:'13px',color:'#fff'}}>
                        + Create
                      </button>
                      <button onClick={() => setShowHouseholdModal(true)}
                        style={{flex:1,padding:'11px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'10px',cursor:'pointer',fontWeight:600,fontSize:'13px',color:'#fefcf8'}}>
                        Join with Code
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dietary preferences */}
              <div>
                <label style={{display:'block',marginBottom:'12px',fontWeight:600,color:'#fefcf8',fontSize:'13px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Dietary Preferences</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {[
                    {id:'whole30', label:'💪 Whole30'},
                    {id:'vegetarian', label:'🥦 Vegetarian'},
                    {id:'vegan', label:'🌱 Vegan'},
                    {id:'gluten-free', label:'🌾 Gluten-Free'},
                    {id:'dairy-free', label:'🥛 Dairy-Free'},
                    {id:'keto', label:'🥩 Keto'},
                    {id:'paleo', label:'🍖 Paleo'},
                    {id:'nut-free', label:'🥜 Nut-Free'},
                    {id:'low-carb', label:'📉 Low-Carb'},
                    {id:'high-protein', label:'💪 High-Protein'}
                  ].map(pref => {
                    const active = profile.dietaryPrefs.includes(pref.id);
                    return (
                      <button key={pref.id} onClick={() => setProfile(p => ({...p, dietaryPrefs: active ? p.dietaryPrefs.filter(x => x !== pref.id) : [...p.dietaryPrefs, pref.id]}))}
                        style={{padding:'7px 14px',background:active?'#ffffff':'#1a1a1a',color:active?'#000':'#888',border:`1px solid ${active?'#fff':'#2a2a2a'}`,borderRadius:'20px',cursor:'pointer',fontSize:'13px',fontWeight:600,transition:'all 0.15s'}}>
                        {pref.label}
                      </button>
                    );
                  })}
                </div>
                <p style={{margin:'10px 0 0 0',fontSize:'11px',color:'#7a7060'}}>Used to personalise your experience</p>
              </div>

              {/* Grocery preferences */}
              <div>
                <label style={{display:'block',marginBottom:'4px',fontWeight:600,color:'#fefcf8',fontSize:'13px',textTransform:'uppercase',letterSpacing:'0.5px'}}>Grocery Preferences</label>
                <p style={{margin:'0 0 12px 0',fontSize:'11px',color:'#7a7060',lineHeight:'1.5'}}>When ordering via Kroger or Instacart, we'll search for these versions of your ingredients automatically.</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {[
                    {id:'organic', label:'🌿 Organic'},
                    {id:'sugar-free', label:'🚫🍬 Sugar-Free'},
                    {id:'dairy-free', label:'🥛 Dairy-Free'},
                    {id:'low-sodium', label:'🧂 Low-Sodium'},
                    {id:'fat-free', label:'⚡ Fat-Free'},
                    {id:'non-gmo', label:'🌱 Non-GMO'},
                    {id:'whole-grain', label:'🌾 Whole Grain'},
                    {id:'gluten-free', label:'✳️ Gluten-Free'},
                    {id:'free-range', label:'🐓 Free-Range'},
                    {id:'no-added-sugar', label:'🍯 No Added Sugar'},
                  ].map(pref => {
                    const active = (profile.groceryPrefs || []).includes(pref.id);
                    return (
                      <button key={pref.id} onClick={() => setProfile(p => ({...p, groceryPrefs: active ? (p.groceryPrefs||[]).filter(x => x !== pref.id) : [...(p.groceryPrefs||[]), pref.id]}))}
                        style={{padding:'7px 14px',background:active?'#ffffff':'#1a1a1a',color:active?'#000':'#888',border:`1px solid ${active?'#fff':'#2a2a2a'}`,borderRadius:'20px',cursor:'pointer',fontSize:'13px',fontWeight:600,transition:'all 0.15s'}}>
                        {pref.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Sticky footer with save + sign out */}
            <div style={{padding:'16px 24px',borderTop:'1px solid #1e1e1e',display:'flex',flexDirection:'column',gap:'10px',flexShrink:0}}>
              <button onClick={saveProfile} disabled={profileSaving}
                style={{width:'100%',padding:'13px',background:profileSaved?'#51cf66':'#ffffff',color:profileSaved?'#fff':'#000',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:700,cursor:profileSaving?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',transition:'background 0.3s',opacity:profileSaving?0.7:1}}>
                {profileSaved ? <><Check size={16} /> Saved!</> : profileSaving ? 'Saving...' : 'Save Profile'}
              </button>
              <button onClick={async () => { await supabase.auth.signOut(); setMealPlan(emptyMealPlan); setUserRecipes([]); setSavedRecipes(new Set()); setShowProfilePanel(false); }}
                style={{width:'100%',padding:'13px',background:'transparent',color:'#6a6050',border:'1px solid #d0c8bc',borderRadius:'10px',fontSize:'14px',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* RECIPE SELECTOR MODAL */}
      {showRecipeSelector && (
        <div style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{background:'#fefcf8',borderRadius:'12px',padding:'24px',maxWidth:'820px',width:'100%',maxHeight:'80vh',overflow:'auto',border:'1px solid #e0d8cc'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
              <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Choose a Recipe</h2>
              <button onClick={() => { setShowRecipeSelector(null); setRecipeSearchQuery(''); }} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
            </div>
            <input type="text" placeholder="Search by name, tag or ingredient..." value={recipeSearchQuery} onChange={e => setRecipeSearchQuery(e.target.value)} autoFocus
              style={{width:'100%',padding:'10px 14px',border:'1px solid #e0d8cc',borderRadius:'8px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',outline:'none',marginBottom:'14px',boxSizing:'border-box'}} />
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(190px, 1fr))',gap:'10px'}}>
              {allMyRecipes.filter(r =>
                r.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()) ||
                r.tags?.some(t => t.toLowerCase().includes(recipeSearchQuery.toLowerCase())) ||
                r.ingredients?.some(i => i.toLowerCase().includes(recipeSearchQuery.toLowerCase()))
              ).map(recipe => (
                <div key={recipe.id} onClick={() => { addMealToPlan(showRecipeSelector.dayIndex, showRecipeSelector.mealType, recipe); setRecipeSearchQuery(''); }}
                  style={{background:'#f0ece4',borderRadius:'10px',overflow:'hidden',cursor:'pointer',border:'1px solid #d8d0c4'}}>
                  {recipe.image
                    ? <div style={{height:'90px',backgroundImage:`url(${recipe.image})`,backgroundSize:'cover',backgroundPosition:'center'}} />
                    : <div style={{height:'90px',background:'#f0ece4',display:'flex',alignItems:'center',justifyContent:'center',padding:'8px'}}><p style={{margin:0,fontSize:'13px',fontWeight:700,color:'#1c2820',textAlign:'center',lineHeight:1.3}}>{recipe.name}</p></div>
                  }
                  <div style={{padding:'10px'}}>
                    <p style={{margin:'0 0 2px 0',fontSize:'13px',fontWeight:600,color:'#1c2820'}}>{recipe.name}</p>
                    <p style={{margin:0,fontSize:'11px',color:'#9a9080'}}>{recipe.prepTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD TO CALENDAR MODAL */}
      {showAddToCalendar && (
        <div style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{background:'#fefcf8',borderRadius:'12px',padding:'24px',maxWidth:'520px',width:'100%',maxHeight:'80vh',overflow:'auto',border:'1px solid #e0d8cc'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'18px'}}>
              <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Add to Calendar</h2>
              <button onClick={() => setShowAddToCalendar(null)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
            </div>
            <div style={{background:'#f0ece4',padding:'12px',borderRadius:'8px',marginBottom:'18px'}}>
              <p style={{margin:'0 0 2px 0',fontWeight:600,color:'#1c2820'}}>{showAddToCalendar.name}</p>
              <p style={{margin:0,fontSize:'12px',color:'#9a9080'}}>{showAddToCalendar.prepTime}</p>
            </div>
            <p style={{color:'#6a6050',marginBottom:'14px',fontSize:'13px'}}>Grayed out = already filled or disabled</p>
            {daysOfWeek.map((day, di) => (
              <div key={day} style={{marginBottom:'10px'}}>
                <p style={{margin:'0 0 5px 0',fontSize:'11px',fontWeight:700,color:'#9a9080',textTransform:'uppercase',letterSpacing:'0.5px'}}>{day}</p>
                <div style={{display:'flex',gap:'6px'}}>
                  {mealTypes.map(mt => {
                    const canAdd = !isSlotDisabled(di, mt) && !mealPlan[di][mt];
                    return (
                      <button key={mt} disabled={!canAdd} onClick={() => { addMealToPlan(di, mt, showAddToCalendar); setShowAddToCalendar(null); }}
                        style={{flex:1,padding:'9px 4px',background:canAdd?'#fff':'#262626',color:canAdd?'#000':'#555',border:canAdd?'none':'1px solid #333',borderRadius:'6px',fontSize:'12px',fontWeight:600,cursor:canAdd?'pointer':'not-allowed',textTransform:'capitalize',opacity:canAdd?1:0.6}}>
                        {mt}
                        {mealPlan[di][mt] && <span style={{display:'block',fontSize:'9px',color:'#9a9080'}}>filled</span>}
                        {isSlotDisabled(di,mt) && <span style={{display:'block',fontSize:'9px',color:'#9a9080'}}>off</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SHOPPING LIST MODAL */}
      {showShoppingList && (
        <div style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{background:'#fefcf8',borderRadius:'12px',padding:'24px',maxWidth:'520px',width:'100%',maxHeight:'85vh',display:'flex',flexDirection:'column',border:'1px solid #e0d8cc'}}>

            {/* Header */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px',flexShrink:0}}>
              <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Shopping List</h2>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                {checkedItems.size > 0 && (
                  <button onClick={() => setCheckedItems(new Set())} style={{background:'none',border:'none',cursor:'pointer',fontSize:'12px',color:'#9a9080',fontWeight:500}}>
                    Clear checked
                  </button>
                )}
                <button onClick={() => setShowShoppingList(false)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#9a9080" /></button>
              </div>
            </div>
            <p style={{margin:'4px 0 14px',fontSize:'12px',color:'#9a9080',flexShrink:0,fontFamily:"'Jost',sans-serif",lineHeight:'1.5'}}>
              Tap any item to mark it off — use this for things you already have or don't need to buy.
            </p>

            {/* Grocery Ordering Buttons */}
            {(() => {
              const list = generateShoppingList();
              const allIngredients = Object.values(list).flat().filter(item => !checkedItems.has(`${Object.keys(list).find(k => list[k].includes(item))}:${item.name}`));
              const hasItems = allIngredients.length > 0;

              // ── INSTACART CONFIG ──────────────────────────────
              const INSTACART_API_KEY = null; // Replace with key once approved
              const INSTACART_AFFILIATE_ID = null; // Replace with affiliate ID once approved

              // ── KROGER CONFIG ──────────────────────────────────
              const KROGER_CLIENT_ID = 'thereciperoulette-bbcc09pc';
              const KROGER_REDIRECT_URI = 'https://reciperoulette.io/auth/callback';
              const KROGER_SCOPES = 'cart.basic:write product.compact';

              // ── INSTACART HANDLER ──────────────────────────────
              const openInstacart = () => {
                if (INSTACART_API_KEY) {
                  fetch('https://connect.instacart.com/idp/v1/products/recipe', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${INSTACART_API_KEY}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: 'Recipe Roulette — Weekly Groceries',
                      image_url: 'https://reciperoulette.io/logo.png',
                      author: 'Recipe Roulette',
                      landing_page_configuration: { partner_linkback_url: 'https://reciperoulette.io', enable_pantry_items: true },
                      ingredients: allIngredients.map(i => ({
                        name: i.name,
                        measurements: [{ quantity: i.count || 1, unit: 'each' }]
                      }))
                    })
                  })
                  .then(r => r.json())
                  .then(data => { if (data?.products_link_url) window.open(data.products_link_url, '_blank'); })
                  .catch(() => window.open('https://www.instacart.com', '_blank'));
                } else {
                  // Fallback until API key arrives
                  const query = allIngredients.slice(0, 3).map(i => i.name).join(', ');
                  window.open(`https://www.instacart.com/store/s?k=${encodeURIComponent(query)}`, '_blank');
                }
              };

              // ── KROGER HANDLER ─────────────────────────────────
              const getKrogerAppToken = async () => {
                const creds = btoa(`${KROGER_CLIENT_ID}:KIJMvRMbsD0cf19lnsiU06SCp3pzlh0-_3eofy1K`);
                const res = await fetch('https://reciperoulette.io/api/kroger-token', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ grant_type: 'client_credentials', scope: 'product.compact' })
                });
                const data = await res.json();
                return data.access_token;
              };

              const getLocationId = async (zip) => {
                const cached = sessionStorage.getItem(`kroger_location_${zip}`);
                if (cached) return cached;
                try {
                  const appToken = await getKrogerAppToken();
                  const res = await fetch('https://reciperoulette.io/api/kroger-proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: `/v1/locations?filter.zipCode=${zip}&filter.limit=1`, method: 'GET', token: appToken })
                  });
                  const data = await res.json();
                  const locationId = data?.data?.[0]?.locationId;
                  if (locationId) sessionStorage.setItem(`kroger_location_${zip}`, locationId);
                  return locationId || null;
                } catch (e) {
                  return null;
                }
              };

              const openKroger = async () => {
                const krogerToken = sessionStorage.getItem('kroger_access_token');
                if (krogerToken) {
                  try {
                    // Get location ID from zip code for accurate product search
                    const zip = profile.zipCode || sessionStorage.getItem('kroger_zip');
                    let locationId = null;
                    if (zip) {
                      locationId = await getLocationId(zip);
                    }
                    if (!locationId) {
                      // Prompt for zip if we don't have one
                      const enteredZip = window.prompt('Enter your zip code to find your nearest Kroger:');
                      if (enteredZip) {
                        sessionStorage.setItem('kroger_zip', enteredZip.trim());
                        locationId = await getLocationId(enteredZip.trim());
                        // Save to profile if logged in
                        if (session?.user && enteredZip.trim()) {
                          await supabase.from('profiles').update({ zip_code: enteredZip.trim() }).eq('id', session.user.id);
                          setProfile(p => ({ ...p, zipCode: enteredZip.trim() }));
                        }
                      }
                    }
                    const cartItems = [];
                    for (const ingredient of allIngredients.slice(0, 50)) {
                      const locationParam = locationId ? `&filter.locationId=${locationId}` : '';
                      const groceryPrefStr = (profile.groceryPrefs || []).join(' ');
                      const searchTerm = groceryPrefStr ? `${groceryPrefStr} ${ingredient.name}` : ingredient.name;
                      const searchRes = await fetch('https://reciperoulette.io/api/kroger-proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: `/v1/products?filter.term=${encodeURIComponent(searchTerm)}&filter.limit=1${locationParam}`, method: 'GET', token: krogerToken })
                      });
                      const searchData = await searchRes.json();
                      const product = searchData?.data?.[0];
                      if (product) cartItems.push({ upc: product.upc, quantity: ingredient.count || 1, modality: 'PICKUP' });
                    }
                    if (cartItems.length > 0) {
                      await fetch('https://reciperoulette.io/api/kroger-proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: '/v1/cart/add', method: 'PUT', token: krogerToken, body: { items: cartItems } })
                      });
                      window.location.href = 'https://www.kroger.com/cart';
                    } else {
                      alert('No matching Kroger products found for your ingredients.');
                    }
                  } catch (e) {
                    sessionStorage.removeItem('kroger_access_token');
                    openKroger();
                  }
                } else {
                  // No token — start OAuth2 flow, save zip if we have it
                  if (profile.zipCode) sessionStorage.setItem('kroger_zip', profile.zipCode);
                  const state = Math.random().toString(36).slice(2);
                  sessionStorage.setItem('kroger_oauth_state', state);
                  sessionStorage.setItem('kroger_pending_ingredients', JSON.stringify(allIngredients));
                  const authUrl = `https://api.kroger.com/v1/connect/oauth2/authorize?` +
                    `response_type=code` +
                    `&client_id=${KROGER_CLIENT_ID}` +
                    `&redirect_uri=${encodeURIComponent(KROGER_REDIRECT_URI)}` +
                    `&scope=${encodeURIComponent(KROGER_SCOPES)}` +
                    `&state=${state}`;
                  window.location.href = authUrl;
                }
              };

              return hasItems ? (
                <div style={{marginBottom:'16px',flexShrink:0}}>
                  <p style={{margin:'0 0 8px',fontSize:'11px',color:'#8a7a6a',fontWeight:600,letterSpacing:'1px',textTransform:'uppercase',fontFamily:"'Jost',sans-serif"}}>Order groceries</p>
                  <div style={{display:'flex',gap:'8px'}}>
                    {/* Instacart — delivery */}
                    <button onClick={openInstacart} style={{flex:1,padding:'11px 8px',background:'#1c2820',border:'none',borderRadius:'8px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',fontFamily:"'Jost',sans-serif",transition:'opacity 0.15s'}}
                      onMouseOver={e => e.currentTarget.style.opacity='0.85'} onMouseOut={e => e.currentTarget.style.opacity='1'}>
                      <img src="https://www.instacart.com/favicon.ico" style={{width:'20px',height:'20px',borderRadius:'4px'}} onError={e => e.target.style.display='none'} />
                      <span style={{fontWeight:600,fontSize:'12px',color:'#f0ece4'}}>Instacart</span>
                      <span style={{fontSize:'10px',color:'#4a6a52'}}>Delivery</span>
                    </button>
                    {/* Kroger — pickup */}
                    <button onClick={openKroger} style={{flex:1,padding:'11px 8px',background:'#003087',border:'none',borderRadius:'8px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',fontFamily:"'Jost',sans-serif",transition:'opacity 0.15s'}}
                      onMouseOver={e => e.currentTarget.style.opacity='0.85'} onMouseOut={e => e.currentTarget.style.opacity='1'}>
                      <img src="https://www.kroger.com/favicon.ico" style={{width:'20px',height:'20px',borderRadius:'4px'}} onError={e => e.target.style.display='none'} />
                      <span style={{fontWeight:600,fontSize:'12px',color:'#ffffff'}}>Kroger</span>
                      <span style={{fontSize:'10px',color:'#a0b8e0'}}>Pickup</span>
                    </button>
                  </div>
                  <p style={{margin:'6px 0 0',fontSize:'10px',color:'#9a9080',textAlign:'center',fontFamily:"'Jost',sans-serif"}}>
                    {allIngredients.length} items · {!INSTACART_API_KEY ? 'Instacart full sync coming soon · ' : ''}Kroger requires sign-in
                  </p>
                </div>
              ) : null;
            })()}

            {/* Divider */}
            <div style={{height:'1px',background:'#e8e0d4',marginBottom:'16px',flexShrink:0}} />

            {/* Items list - scrollable */}
            <div style={{overflowY:'auto',flex:1}}>
              {(() => {
                const list = generateShoppingList();
                const hasItems = Object.values(list).some(a => a.length > 0);
                if (!hasItems) return <p style={{color:'#9a9080',textAlign:'center',padding:'40px 0',fontFamily:"'Jost',sans-serif"}}>No meals planned yet — add some to your calendar!</p>;
                return Object.entries(list).map(([cat, items]) => {
                  if (!items.length) return null;
                  const needed = items.filter(item => !checkedItems.has(`${cat}:${item.name}`));
                  const have = items.filter(item => checkedItems.has(`${cat}:${item.name}`));
                  const allItems = [...needed, ...have];
                  return (
                    <div key={cat} style={{marginBottom:'20px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                        <span style={{fontSize:'9px',fontWeight:600,color:'#c46a3a',letterSpacing:'3px',textTransform:'uppercase',fontFamily:"'Jost',sans-serif"}}>{cat}</span>
                        <div style={{flex:1,height:'1px',background:'#ece8e0'}} />
                      </div>
                      {allItems.map((item, i) => {
                        const key = `${cat}:${item.name}`;
                        const isChecked = checkedItems.has(key);
                        return (
                          <div key={i} onClick={() => {
                            setCheckedItems(prev => {
                              const next = new Set(prev);
                              isChecked ? next.delete(key) : next.add(key);
                              return next;
                            });
                          }} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 12px',marginBottom:'3px',borderRadius:'5px',cursor:'pointer',background:isChecked?'transparent':'#fff',border:`1px solid ${isChecked?'#ece8e0':'#e8e4dc'}`,transition:'all 0.15s',opacity:isChecked?0.5:1}}>
                            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                              <div style={{width:'16px',height:'16px',borderRadius:'3px',border:`1.5px solid ${isChecked?'#c0392b':'#c8c0b4'}`,background:isChecked?'#c0392b':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.15s'}}>
                                {isChecked && <span style={{color:'#fff',fontSize:'10px',fontWeight:700,lineHeight:1}}>✕</span>}
                              </div>
                              <span style={{fontSize:'14px',color:isChecked?'#9a9080':'#1c2820',textDecoration:isChecked?'line-through':'none',transition:'all 0.15s',fontFamily:"'Jost',sans-serif"}}>{item.name}</span>
                            </div>
                            {item.count > 1 && <span style={{background:'#f0ece4',color:'#6a6050',padding:'2px 8px',borderRadius:'10px',fontSize:'11px',fontWeight:600}}>×{item.count}</span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                });
              })()}
            </div>

          </div>
        </div>
      )}

      {/* AUTO-FILL MODAL */}
      {/* SPINNING WHEEL */}
      {showSpinningWheel && (
        <div style={{position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 40%, #0d0d20 0%, #0a0a0a 65%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:2000,userSelect:'none'}}>
          <style>{`
            @keyframes wheelPointerBounce {
              0%,100% { transform: translateY(0); }
              25% { transform: translateY(-16px); }
              50% { transform: translateY(5px); }
              70% { transform: translateY(-7px); }
              88% { transform: translateY(2px); }
            }
            @keyframes wheelShimmerSpin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes wheelPulse {
              0%,100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
            @keyframes wheelFadeUp {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .wheel-ptr-bounce { animation: wheelPointerBounce 0.9s ease forwards; }
            .wheel-pulse { animation: wheelPulse 0.85s ease-in-out infinite; }
            .wheel-fade-up { animation: wheelFadeUp 0.4s ease forwards; }
          `}</style>

          {/* Pointer */}
          <div className={wheelPointerBounce ? 'wheel-ptr-bounce' : ''} style={{width:0,height:0,borderLeft:'12px solid transparent',borderRight:'12px solid transparent',borderTop:'26px solid #fff',marginBottom:'-13px',zIndex:10,filter:'drop-shadow(0 0 10px rgba(255,255,255,0.9))'}} />

          {/* Wheel wrapper */}
          <div style={{position:'relative',width:'300px',height:'300px'}}>
            {/* Glow ring */}
            <div style={{position:'absolute',inset:'-10px',borderRadius:'50%',boxShadow:wheelSpinning?'0 0 50px rgba(255,255,255,0.07), 0 0 100px rgba(255,255,255,0.03)':'0 0 20px rgba(255,255,255,0.03)',transition:'box-shadow 0.6s',pointerEvents:'none',zIndex:0}} />
            {/* Shimmer */}
            {wheelShimmer && (
              <div style={{position:'absolute',inset:0,borderRadius:'50%',background:'conic-gradient(transparent 0deg, rgba(255,255,255,0.07) 60deg, transparent 120deg)',animation:'wheelShimmerSpin 0.75s linear infinite',zIndex:4,pointerEvents:'none'}} />
            )}
            <canvas ref={wheelCanvasRef} width={300} height={300} style={{borderRadius:'50%',display:'block',position:'relative',zIndex:1}} />
            {/* Center logo */}
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'80px',height:'80px',borderRadius:'50%',background:'#f4f0ea',border:'2px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:5,boxShadow:'0 0 24px rgba(0,0,0,1), inset 0 0 12px rgba(0,0,0,0.8)',overflow:'hidden'}}>
              <img src="/logo.png" alt="logo" style={{width:'72px',height:'72px',objectFit:'contain'}} />
            </div>
          </div>

          {/* Status */}
          <div style={{height:'56px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',marginTop:'28px'}}>
            {wheelSpinning ? (
              <p className="wheel-pulse" style={{margin:0,fontSize:'20px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Spinning your meals...</p>
            ) : wheelDone ? (
              <p className="wheel-fade-up" style={{margin:0,fontSize:'18px',fontWeight:700,color:'#5a9a6a',textShadow:'0 0 24px rgba(81,207,102,0.7)'}}>✓ Your meals are ready!</p>
            ) : null}
          </div>
        </div>
      )}

      {showAutoFillModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{background:'#fefcf8',borderRadius:'12px',padding:'24px',maxWidth:'440px',width:'100%',border:'1px solid #e0d8cc'}}>
            <h2 style={{margin:'0 0 4px 0',fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Auto-Fill Settings</h2>
            <p style={{margin:'0 0 20px 0',fontSize:'13px',color:'#9a9080'}}>Customize how many of each type to add</p>

            {/* Quick & Easy */}
            <div style={{marginBottom:'16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                <div>
                  <label style={{fontWeight:600,color:'#1c2820',fontSize:'14px'}}>⚡ Quick & Easy Meals</label>
                  <p style={{margin:'2px 0 0',fontSize:'11px',color:'#6a6050'}}>Ready in 30 mins or less</p>
                </div>
                <span style={{background:'#1c2820',color:'#f0ece4',padding:'2px 10px',borderRadius:'8px',fontWeight:700,fontSize:'14px',alignSelf:'flex-start'}}>{autoFillSettings.easyMeals}</span>
              </div>
              <input type="range" min="0" max="7" value={autoFillSettings.easyMeals} onChange={e => setAutoFillSettings(p => ({...p,easyMeals:parseInt(e.target.value)}))} style={{width:'100%',marginTop:'6px'}} />
            </div>

            {/* Popular Community */}
            <div style={{marginBottom:'16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                <div>
                  <label style={{fontWeight:600,color:'#1c2820',fontSize:'14px'}}>🌟 Popular Community Meals</label>
                  <p style={{margin:'2px 0 0',fontSize:'11px',color:'#6a6050'}}>Top rated by the community</p>
                </div>
                <span style={{background:'#1c2820',color:'#f0ece4',padding:'2px 10px',borderRadius:'8px',fontWeight:700,fontSize:'14px',alignSelf:'flex-start'}}>{autoFillSettings.communityMeals}</span>
              </div>
              <input type="range" min="0" max="7" value={autoFillSettings.communityMeals} onChange={e => setAutoFillSettings(p => ({...p,communityMeals:parseInt(e.target.value)}))} style={{width:'100%',marginTop:'6px'}} />
            </div>

            {/* Untried */}
            <div style={{marginBottom:'16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                <div>
                  <label style={{fontWeight:600,color:'#1c2820',fontSize:'14px'}}>🆕 Recipes Not Yet Tried</label>
                  <p style={{margin:'2px 0 0',fontSize:'11px',color:'#6a6050'}}>Branch out and try something new</p>
                </div>
                <span style={{background:'#1c2820',color:'#f0ece4',padding:'2px 10px',borderRadius:'8px',fontWeight:700,fontSize:'14px',alignSelf:'flex-start'}}>{autoFillSettings.untriedRecipes}</span>
              </div>
              <input type="range" min="0" max="7" value={autoFillSettings.untriedRecipes} onChange={e => setAutoFillSettings(p => ({...p,untriedRecipes:parseInt(e.target.value)}))} style={{width:'100%',marginTop:'6px'}} />
            </div>

            {/* Budget Friendly */}
            <div style={{marginBottom:'8px',background:'#f4fbf6',border:'1px solid #c0dcc8',borderRadius:'10px',padding:'12px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                <div>
                  <label style={{fontWeight:600,color:'#5a9a6a',fontSize:'14px'}}>💰 Budget Friendly Meals</label>
                  <p style={{margin:'2px 0 0',fontSize:'11px',color:'#3a6a42'}}>$5 or less per serving</p>
                </div>
                <span style={{background:'#5a9a6a',color:'#1c2820',padding:'2px 10px',borderRadius:'8px',fontWeight:700,fontSize:'14px',alignSelf:'flex-start'}}>{autoFillSettings.budgetMeals}</span>
              </div>
              <input type="range" min="0" max="7" value={autoFillSettings.budgetMeals} onChange={e => setAutoFillSettings(p => ({...p,budgetMeals:parseInt(e.target.value)}))} style={{width:'100%',marginTop:'6px',accentColor:'#51cf66'}} />
              {autoFillSettings.budgetMeals > 0 && (
                <div style={{marginTop:'10px'}}>
                  {(() => {
                    const allR = [...(guestMode ? [...sampleRecipes,...userRecipes] : userRecipes),...allCommunityRecipes];
                    const unpriced = allR.filter(r => recipeCostCache[r.id] === undefined);
                    const budgetCount = allR.filter(r => recipeCostCache[r.id] !== undefined && recipeCostCache[r.id] <= 5).length;
                    if (unpriced.length > 0) return (
                      <button onClick={async () => {
                        const toPrice = unpriced.slice(0, 10);
                        const newCache = {...recipeCostCache};
                        for (const recipe of toPrice) {
                          try {
                            const resp = await fetch('https://api.anthropic.com/v1/messages', {
                              method: 'POST',
                              headers: {'Content-Type':'application/json'},
                              body: JSON.stringify({
                                model: 'claude-sonnet-4-6',
                                max_tokens: 100,
                                messages: [{
                                  role: 'user',
                                  content: `Estimate the cost per serving in USD for this recipe using average grocery store prices${profile.zipCode ? ` for ZIP code ${profile.zipCode}` : ' in California'}. Reply with ONLY a number like 4.50, nothing else.

Recipe: ${recipe.name}
Servings: ${recipe.servings}
Ingredients: ${(recipe.ingredients||[]).join(', ')}`
                                }]
                              })
                            });
                            const data = await resp.json();
                            const cost = parseFloat(data?.content?.[0]?.text?.trim());
                            if (!isNaN(cost)) newCache[recipe.id] = cost;
                          } catch(e) { console.error('cost est failed', e); }
                        }
                        setRecipeCostCache(newCache);
                      }} style={{width:'100%',padding:'8px',background:'#5a9a6a',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:700,fontSize:'12px',color:'#1c2820'}}>
                        ✦ Estimate Costs with AI ({unpriced.length} recipes need pricing)
                      </button>
                    );
                    return <p style={{fontSize:'12px',color:'#5a9a6a',margin:0}}>✓ {budgetCount} budget-friendly recipes found in your collection</p>;
                  })()}
                </div>
              )}
            </div>

            <div style={{display:'flex',gap:'10px',marginTop:'20px'}}>
              <button onClick={() => setShowAutoFillModal(false)} style={{flex:1,padding:'11px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820'}}>Cancel</button>
              <button onClick={autoFillCalendar} style={{flex:1,padding:'11px',background:'#1c2820',border:'none',borderRadius:'4px',cursor:'pointer',fontWeight:600,color:'#f0ece4'}}>Fill Calendar</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD RECIPE MODAL */}
      {showAddRecipeModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{background:'#fefcf8',borderRadius:'12px',padding:'24px',maxWidth:'560px',width:'100%',maxHeight:'90vh',overflow:'auto',border:'1px solid #e0d8cc'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'18px'}}>
              <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Add New Recipe</h2>
              <button onClick={() => { setShowAddRecipeModal(false); setRecipeImagePreview(null); }} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const newRecipe = {
                id: Date.now(),
                name: fd.get('name'),
                prepTime: fd.get('prepTime') || '30 min',
                cookTime: parseInt(fd.get('cookTime')) || 30,
                servings: parseInt(fd.get('servings')) || 4,
                image: recipeImagePreview || '',
                ingredients: fd.get('ingredients').split('\n').filter(i => i.trim()),
                instructions: fd.get('instructions').split('\n').filter(i => i.trim()),
                tags: [fd.get('mealType'), ...fd.get('tags').split(',').map(t => t.trim()).filter(t => t)],
                author: session?.user?.email?.split('@')[0],
                timesMade: 0,
                isEasy: parseInt(fd.get('cookTime')) < 20
              };
              setUserRecipes(prev => [...prev, newRecipe]);
              await supabase.from('user_recipes').insert({user_id:session.user.id, recipe:newRecipe});
              setShowAddRecipeModal(false);
              setRecipeImagePreview(null);
              e.target.reset();
            }}>
              <div style={{marginBottom:'14px'}}>
                <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Recipe Image</label>
                <div style={{border:'2px dashed #262626',borderRadius:'8px',padding:'16px',textAlign:'center',background:'#f4f0ea',position:'relative',overflow:'hidden',minHeight:'90px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {recipeImagePreview ? (
                    <div style={{position:'relative',width:'100%'}}>
                      <img src={recipeImagePreview} alt="Preview" style={{maxWidth:'100%',maxHeight:'140px',borderRadius:'6px',objectFit:'cover'}} />
                      <button type="button" onClick={() => setRecipeImagePreview(null)} style={{position:'absolute',top:'4px',right:'4px',background:'rgba(0,0,0,0.7)',border:'none',borderRadius:'50%',width:'26px',height:'26px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><X size={14} color="white" /></button>
                    </div>
                  ) : (
                    <>
                      <input type="file" accept="image/*" onChange={e => { const f=e.target.files[0]; if(f){const r=new FileReader();r.onloadend=()=>setRecipeImagePreview(r.result);r.readAsDataURL(f);} }} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer'}} />
                      <div style={{color:'#7a7060',fontSize:'13px',padding:'8px'}}>
                        <div style={{fontSize:'28px',marginBottom:'6px'}}>📸</div>
                        <p style={{margin:'0 0 4px 0',fontWeight:600,color:'#1c2820'}}>Add a photo of the finished dish</p>
                        <p style={{margin:0,fontSize:'11px',color:'#7a7060'}}>Tap to upload — your own photo looks way better!</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div style={{marginBottom:'12px'}}>
                <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Recipe Name *</label>
                <input name="name" required placeholder="e.g. Spaghetti Carbonara" style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',boxSizing:'border-box'}} />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                {[['prepTime','Prep Time','text','20 min'],['cookTime','Cook Time (min)','number','30'],['servings','Servings','number','4']].map(([name,label,type,ph]) => (
                  <div key={name}>
                    <label style={{display:'block',marginBottom:'4px',fontWeight:600,color:'#1c2820',fontSize:'12px'}}>{label}</label>
                    <input name={name} type={type} placeholder={ph} style={{width:'100%',padding:'9px 10px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'13px',background:'#f4f0ea',color:'#1c2820',boxSizing:'border-box'}} />
                  </div>
                ))}
              </div>
              <div style={{marginBottom:'12px'}}>
                <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Meal Type *</label>
                <select name="mealType" required style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',cursor:'pointer'}}>
                  <option value="">Select...</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              {[['ingredients','Ingredients (one per line) *','1 cup quinoa\n2 cups water...'],['instructions','Instructions (one step per line) *','Rinse quinoa...\nBring to boil...']].map(([name,label,ph]) => (
                <div key={name} style={{marginBottom:'12px'}}>
                  <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>{label}</label>
                  <textarea name={name} required rows={4} placeholder={ph} style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'13px',background:'#f4f0ea',color:'#1c2820',fontFamily:"'Jost',sans-serif",resize:'vertical',boxSizing:'border-box'}} />
                </div>
              ))}
              <div style={{marginBottom:'18px'}}>
                <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Tags (comma separated)</label>
                <input name="tags" placeholder="Italian, Quick, Healthy" style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',boxSizing:'border-box'}} />
              </div>
              <div style={{display:'flex',gap:'10px'}}>
                <button type="button" onClick={() => { setShowAddRecipeModal(false); setRecipeImagePreview(null); }} style={{flex:1,padding:'11px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820'}}>Cancel</button>
                <button type="submit" style={{flex:1,padding:'11px',background:'#1c2820',border:'none',borderRadius:'4px',cursor:'pointer',fontWeight:600,color:'#f0ece4'}}>Add Recipe</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT RECIPE MODAL */}
      {showImportModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{background:'#fefcf8',borderRadius:'16px',padding:'28px',maxWidth:'560px',width:'100%',maxHeight:'90vh',overflow:'auto',border:'1px solid #e0d8cc'}}>

            {/* STEP 1: Input (URL or Image) */}
            {importStep === 'url' && (
              <>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
                  <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Import Recipe</h2>
                  <button onClick={() => setShowImportModal(false)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
                </div>

                {/* Mode tabs */}
                <div style={{display:'flex',background:'#f4f0ea',borderRadius:'8px',padding:'4px',marginBottom:'20px',border:'1px solid #e0d8cc'}}>
                  <button onClick={() => { setImportMode('url'); setImportError(''); }} style={{flex:1,padding:'9px',background:importMode==='url'?'#fff':'transparent',color:importMode==='url'?'#000':'#999',border:'none',borderRadius:'6px',fontWeight:600,fontSize:'13px',cursor:'pointer',transition:'all 0.15s'}}>
                    🔗 From URL
                  </button>
                  <button onClick={() => { setImportMode('image'); setImportError(''); }} style={{flex:1,padding:'9px',background:importMode==='image'?'#fff':'transparent',color:importMode==='image'?'#000':'#999',border:'none',borderRadius:'6px',fontWeight:600,fontSize:'13px',cursor:'pointer',transition:'all 0.15s'}}>
                    📷 From Photo
                  </button>
                </div>

                {importMode === 'url' && (
                  <>
                    <p style={{margin:'0 0 14px 0',fontSize:'13px',color:'#6a6050'}}>Works with BudgetBytes, Food Network, NYT Cooking, Serious Eats, and most major recipe sites.</p>
                    <label style={{display:'block',marginBottom:'6px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Recipe URL</label>
                    <input type="url" value={importUrl} onChange={e => { setImportUrl(e.target.value); setImportError(''); }}
                      placeholder="https://www.budgetbytes.com/recipe/..." autoFocus
                      style={{width:'100%',padding:'11px 14px',border:`1px solid ${importError ? '#ff4444' : '#262626'}`,borderRadius:'8px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',outline:'none',boxSizing:'border-box',marginBottom:'8px'}} />
                  </>
                )}

                {importMode === 'image' && (
                  <>
                    <p style={{margin:'0 0 14px 0',fontSize:'13px',color:'#6a6050'}}>Take a photo or upload a screenshot of any recipe — handwritten, cookbook, or screenshot.</p>
                    <div style={{border:`2px dashed ${importImagePreview ? '#51cf66' : '#262626'}`,borderRadius:'10px',padding:'20px',textAlign:'center',background:'#f4f0ea',position:'relative',cursor:'pointer',marginBottom:'8px'}}>
                      {importImagePreview ? (
                        <div style={{position:'relative'}}>
                          <img src={importImagePreview} alt="Recipe" style={{maxWidth:'100%',maxHeight:'200px',borderRadius:'8px',objectFit:'contain'}} />
                          <button type="button" onClick={() => { setImportImageFile(null); setImportImagePreview(null); }} style={{position:'absolute',top:'4px',right:'4px',background:'rgba(0,0,0,0.7)',border:'none',borderRadius:'50%',width:'26px',height:'26px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><X size={14} color="white" /></button>
                        </div>
                      ) : (
                        <>
                          <input type="file" accept="image/*" onChange={e => {
                            const f = e.target.files[0];
                            if (f) { setImportImageFile(f); const r = new FileReader(); r.onloadend = () => setImportImagePreview(r.result); r.readAsDataURL(f); }
                          }} style={{position:'absolute',inset:0,opacity:0,cursor:'pointer',width:'100%',height:'100%'}} />
                          <div style={{fontSize:'36px',marginBottom:'8px'}}>📷</div>
                          <p style={{margin:'0 0 4px 0',fontWeight:600,color:'#1c2820',fontSize:'14px'}}>Tap to take photo or upload</p>
                          <p style={{margin:0,fontSize:'12px',color:'#7a7060'}}>Works with handwritten recipes, cookbooks, screenshots</p>
                        </>
                      )}
                    </div>
                  </>
                )}

                {importError && <p style={{margin:'8px 0 0 0',fontSize:'12px',color:'#c46a3a'}}>{importError}</p>}
                <div style={{display:'flex',gap:'10px',marginTop:'16px'}}>
                  <button onClick={() => setShowImportModal(false)} style={{flex:1,padding:'11px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820',fontSize:'14px'}}>Cancel</button>
                  <button onClick={async () => {
                    setImportError('');
                    if (importMode === 'url') {
                      if (!importUrl.trim()) { setImportError('Please enter a URL.'); return; }
                      try { new URL(importUrl); } catch { setImportError('Please enter a valid URL.'); return; }
                      setImportStep('loading');
                      try {
                        const { data, error } = await supabase.functions.invoke('fetch-recipe', { body: { url: importUrl.trim() } });
                        if (error || !data?.name) {
                          setImportStep('url');
                          const rawErr = data?.error || '';
                          let friendlyErr;
                          if (rawErr.includes('403') || rawErr.includes('401')) {
                            friendlyErr = "That site blocked our request. Try copying the recipe text manually or use a different recipe site.";
                          } else if (rawErr.includes('404')) {
                            friendlyErr = "That page wasn't found. Double-check the URL and try again.";
                          } else if (rawErr.includes('timeout') || rawErr.includes('ECONNREFUSED') || rawErr.includes('fetch')) {
                            friendlyErr = "Couldn't reach that site. Check your connection or try a different URL.";
                          } else if (!rawErr && !data?.name) {
                            friendlyErr = "No recipe found at that URL. Make sure it links directly to a recipe page, not a homepage or search result.";
                          } else {
                            friendlyErr = "Couldn't import from that URL. Try BudgetBytes, Food Network, NYT Cooking, or Serious Eats.";
                          }
                          setImportError(friendlyErr);
                          return;
                        }
                        setImportedRecipe({ ...data, id: Date.now(), author: session.user.email.split('@')[0], timesMade: 0, isEasy: (data.cookTime || 30) < 20,
                          image: data.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
                          tags: data.tags || [], ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
                          instructions: Array.isArray(data.instructions) ? data.instructions : [],
                          prepTime: data.prepTime || '30 min', servings: data.servings || 4, cookTime: data.cookTime || 30 });
                        setImportStep('review');
                      } catch (err) { setImportStep('url'); setImportError('Something went wrong. Please try again.'); }
                    } else {
                      if (!importImageFile) { setImportError('Please select a photo first.'); return; }
                      setImportStep('loading');
                      try {
                        // Convert image to JPEG if it's HEIC or unsupported format
                        const supportedTypes = ['image/jpeg','image/png','image/gif','image/webp'];
                        let fileToSend = importImageFile;
                        let mediaTypeToSend = importImageFile.type;
                        if (!supportedTypes.includes(mediaTypeToSend)) {
                          // Draw to canvas and export as JPEG
                          const img = new Image();
                          const objectUrl = URL.createObjectURL(importImageFile);
                          await new Promise(resolve => { img.onload = resolve; img.src = objectUrl; });
                          const canvas = document.createElement('canvas');
                          canvas.width = img.width; canvas.height = img.height;
                          canvas.getContext('2d').drawImage(img, 0, 0);
                          URL.revokeObjectURL(objectUrl);
                          const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.9));
                          fileToSend = blob;
                          mediaTypeToSend = 'image/jpeg';
                        }
                        const base64 = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result.split(',')[1]); r.onerror = rej; r.readAsDataURL(fileToSend); });
                        const { data, error } = await supabase.functions.invoke('import-recipe-image', { body: { image: base64, mediaType: mediaTypeToSend } });
                        if (error || !data?.name) { setImportStep('url'); setImportError(data?.error || "Couldn't read a recipe from that image. Try a clearer photo."); return; }
                        setImportedRecipe({ ...data, id: Date.now(), author: session.user.email.split('@')[0], timesMade: 0, isEasy: (data.cookTime || 30) < 20,
                          image: '', tags: data.tags || [], ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
                          instructions: Array.isArray(data.instructions) ? data.instructions : [],
                          prepTime: data.prepTime || '30 min', servings: data.servings || 4, cookTime: data.cookTime || 30 });
                        setImportStep('review');
                      } catch (err) { setImportStep('url'); setImportError('Something went wrong. Please try again.'); }
                    }
                  }} style={{flex:2,padding:'11px',background:importMode==='url'?(importUrl.trim()?'#fff':'#333'):(importImageFile?'#fff':'#333'),border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700,color:importMode==='url'?(importUrl.trim()?'#000':'#666'):(importImageFile?'#000':'#666'),fontSize:'14px',transition:'all 0.2s'}}>
                    {importMode === 'url' ? 'Import Recipe →' : '✨ Read Recipe'}
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: Loading */}
            {importStep === 'loading' && (
              <div style={{textAlign:'center',padding:'40px 20px'}}>
                <div style={{fontSize:'40px',marginBottom:'16px'}}>⏳</div>
                <h3 style={{margin:'0 0 8px 0',fontSize:'20px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>{importMode === 'image' ? 'Reading your photo...' : 'Fetching recipe...'}</h3>
                <p style={{margin:0,fontSize:'13px',color:'#6a6050'}}>{importMode === 'image' ? 'Claude is scanning the ingredients and instructions' : 'Parsing ingredients and instructions'}</p>
              </div>
            )}

            {/* STEP 3: Review */}
            {importStep === 'review' && importedRecipe && (
              <>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                  <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Review & Edit</h2>
                  <button onClick={() => setShowImportModal(false)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
                </div>
                <p style={{margin:'0 0 18px 0',fontSize:'13px',color:'#6a6050'}}>Imported from <span style={{color:'#9a9080'}}>{importUrl.replace(/^https?:\/\/(www\.)?/,'').split('/')[0]}</span>. Review and edit before saving.</p>

                {/* Photo — tappable to change */}
                <div style={{position:'relative',borderRadius:'10px',overflow:'hidden',background:'#f8f5ef',border:'1px solid #d8d0c4',minHeight:'120px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px'}}>
                  {importedRecipe.image
                    ? <img src={importedRecipe.image} style={{width:'100%',maxHeight:'160px',objectFit:'cover',display:'block'}} />
                    : <div style={{textAlign:'center',padding:'20px',color:'#7a7060'}}><div style={{fontSize:'32px',marginBottom:'6px'}}>📸</div><p style={{margin:0,fontSize:'12px'}}>No photo</p></div>
                  }
                  <label style={{position:'absolute',bottom:'8px',right:'8px',background:'rgba(20,30,22,0.85)',border:'1px solid #ccc4b8',borderRadius:'8px',padding:'6px 12px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#1c2820',display:'flex',alignItems:'center',gap:'6px'}}>
                    📷 {importedRecipe.image ? 'Change Photo' : 'Add Photo'}
                    <input type="file" accept="image/*" style={{display:'none'}} onChange={e => {
                      const f = e.target.files[0];
                      if (f) { const r = new FileReader(); r.onloadend = () => setImportedRecipe(prev => ({...prev, image: r.result})); r.readAsDataURL(f); }
                    }} />
                  </label>
                  {importedRecipe.image && (
                    <button onClick={() => setImportedRecipe(prev => ({...prev, image: ''}))}
                      style={{position:'absolute',top:'8px',right:'8px',background:'rgba(0,0,0,0.7)',border:'none',borderRadius:'50%',width:'28px',height:'28px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                      <X size={14} color="white" />
                    </button>
                  )}
                </div>

                <div style={{marginBottom:'12px'}}>
                  <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Recipe Name</label>
                  <input value={importedRecipe.name} onChange={e => setImportedRecipe(r => ({...r, name: e.target.value}))}
                    style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',boxSizing:'border-box'}} />
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                  {[['Prep Time','prepTime','text'],['Cook Time (min)','cookTime','number'],['Servings','servings','number']].map(([label,key,type]) => (
                    <div key={key}>
                      <label style={{display:'block',marginBottom:'4px',fontWeight:600,color:'#1c2820',fontSize:'12px'}}>{label}</label>
                      <input type={type} value={importedRecipe[key]} onChange={e => setImportedRecipe(r => ({...r, [key]: type==='number' ? parseInt(e.target.value)||0 : e.target.value}))}
                        style={{width:'100%',padding:'9px 10px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'13px',background:'#f4f0ea',color:'#1c2820',boxSizing:'border-box'}} />
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:'12px'}}>
                  <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Ingredients ({importedRecipe.ingredients.length} items)</label>
                  <textarea value={importedRecipe.ingredients.join('\n')} onChange={e => setImportedRecipe(r => ({...r, ingredients: e.target.value.split('\n').filter(l => l.trim())}))}
                    rows={5} style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'13px',background:'#f4f0ea',color:'#1c2820',fontFamily:"'Jost',sans-serif",resize:'vertical',boxSizing:'border-box'}} />
                </div>
                <div style={{marginBottom:'12px'}}>
                  <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Instructions ({importedRecipe.instructions.length} steps)</label>
                  <textarea value={importedRecipe.instructions.join('\n')} onChange={e => setImportedRecipe(r => ({...r, instructions: e.target.value.split('\n').filter(l => l.trim())}))}
                    rows={5} style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'13px',background:'#f4f0ea',color:'#1c2820',fontFamily:"'Jost',sans-serif",resize:'vertical',boxSizing:'border-box'}} />
                </div>

                {folders.length > 0 && (
                  <div style={{marginBottom:'18px'}}>
                    <label style={{display:'block',marginBottom:'8px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Add to Folders (optional)</label>
                    <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                      {folders.map(f => {
                        const selected = importFolderIds.includes(f.id);
                        return (
                          <button key={f.id} type="button" onClick={() => setImportFolderIds(prev => selected ? prev.filter(id => id !== f.id) : [...prev, f.id])}
                            style={{padding:'7px 14px',background:selected?'#fff':'#262626',color:selected?'#000':'#999',border:`1px solid ${selected?'#fff':'#333'}`,borderRadius:'20px',cursor:'pointer',fontSize:'12px',fontWeight:600,transition:'all 0.15s'}}>
                            {f.emoji} {f.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{display:'flex',gap:'10px'}}>
                  <button onClick={() => { setImportStep('url'); setImportedRecipe(null); }} style={{flex:1,padding:'11px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820',fontSize:'14px'}}>← Back</button>
                  <button onClick={async () => {
                    const finalRecipe = { ...importedRecipe, isEasy: importedRecipe.cookTime < 20 };
                    setUserRecipes(prev => [...prev, finalRecipe]);
                    await supabase.from('user_recipes').insert({ user_id: session.user.id, recipe: finalRecipe });
                    if (importFolderIds.length > 0) {
                      updateFolders(prev => prev.map(f => importFolderIds.includes(f.id) ? {...f, recipes: [...f.recipes, finalRecipe.id]} : f));
                    }
                    setShowImportModal(false);
                    setCurrentView('recipes');
                  }} style={{flex:2,padding:'11px',background:'#fefcf8',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700,color:'#1c2820',fontSize:'14px'}}>
                    ✓ Save to Recipe Book
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* EDIT RECIPE MODAL */}
      {showEditRecipeModal && (
        <div onClick={() => setShowEditRecipeModal(null)} style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fefcf8',borderRadius:'12px',padding:'24px',maxWidth:'560px',width:'100%',maxHeight:'90vh',overflow:'auto',border:'1px solid #e0d8cc'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'18px'}}>
              <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>✏️ Edit Recipe</h2>
              <button onClick={() => setShowEditRecipeModal(null)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
            </div>
            {/* Photo editor */}
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',marginBottom:'6px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Photo</label>
              <div style={{position:'relative',borderRadius:'10px',overflow:'hidden',background:'#f8f5ef',border:'1px solid #d8d0c4',minHeight:'120px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {showEditRecipeModal.image
                  ? <img src={showEditRecipeModal.image} style={{width:'100%',maxHeight:'160px',objectFit:'cover',display:'block'}} />
                  : <div style={{textAlign:'center',padding:'20px',color:'#7a7060'}}><div style={{fontSize:'32px',marginBottom:'6px'}}>📸</div><p style={{margin:0,fontSize:'12px'}}>No photo yet</p></div>
                }
                <label style={{position:'absolute',bottom:'8px',right:'8px',background:'rgba(20,30,22,0.85)',border:'1px solid #ccc4b8',borderRadius:'8px',padding:'6px 12px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#1c2820',display:'flex',alignItems:'center',gap:'6px'}}>
                  📷 {showEditRecipeModal.image ? 'Change Photo' : 'Add Photo'}
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={e => {
                    const f = e.target.files[0];
                    if (f) { const r = new FileReader(); r.onloadend = () => setShowEditRecipeModal(prev => ({...prev, image: r.result})); r.readAsDataURL(f); }
                  }} />
                </label>
                {showEditRecipeModal.image && (
                  <button onClick={() => setShowEditRecipeModal(prev => ({...prev, image: ''}))}
                    style={{position:'absolute',top:'8px',right:'8px',background:'rgba(0,0,0,0.7)',border:'none',borderRadius:'50%',width:'28px',height:'28px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                    <X size={14} color="white" />
                  </button>
                )}
              </div>
            </div>
            <div style={{marginBottom:'12px'}}>
              <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Recipe Name</label>
              <input value={showEditRecipeModal.name} onChange={e => setShowEditRecipeModal(r => ({...r, name: e.target.value}))}
                style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',boxSizing:'border-box'}} />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'12px'}}>
              {[['Prep Time','prepTime','text'],['Cook Time (min)','cookTime','number'],['Servings','servings','number']].map(([label,key,type]) => (
                <div key={key}>
                  <label style={{display:'block',marginBottom:'4px',fontWeight:600,color:'#1c2820',fontSize:'12px'}}>{label}</label>
                  <input type={type} value={showEditRecipeModal[key]} onChange={e => setShowEditRecipeModal(r => ({...r, [key]: type==='number' ? parseInt(e.target.value)||0 : e.target.value}))}
                    style={{width:'100%',padding:'9px 10px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'13px',background:'#f4f0ea',color:'#1c2820',boxSizing:'border-box'}} />
                </div>
              ))}
            </div>
            <div style={{marginBottom:'12px'}}>
              <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Ingredients (one per line)</label>
              <textarea value={Array.isArray(showEditRecipeModal.ingredients) ? showEditRecipeModal.ingredients.join('\n') : showEditRecipeModal.ingredients}
                onChange={e => setShowEditRecipeModal(r => ({...r, ingredients: e.target.value.split('\n').filter(l => l.trim())}))}
                rows={5} style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'13px',background:'#f4f0ea',color:'#1c2820',fontFamily:"'Jost',sans-serif",resize:'vertical',boxSizing:'border-box'}} />
            </div>
            <div style={{marginBottom:'12px'}}>
              <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Instructions (one per line)</label>
              <textarea value={Array.isArray(showEditRecipeModal.instructions) ? showEditRecipeModal.instructions.join('\n') : showEditRecipeModal.instructions}
                onChange={e => setShowEditRecipeModal(r => ({...r, instructions: e.target.value.split('\n').filter(l => l.trim())}))}
                rows={5} style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'13px',background:'#f4f0ea',color:'#1c2820',fontFamily:"'Jost',sans-serif",resize:'vertical',boxSizing:'border-box'}} />
            </div>
            <div style={{marginBottom:'18px'}}>
              <label style={{display:'block',marginBottom:'5px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Tags (comma separated)</label>
              <input value={Array.isArray(showEditRecipeModal.tags) ? showEditRecipeModal.tags.join(', ') : showEditRecipeModal.tags}
                onChange={e => setShowEditRecipeModal(r => ({...r, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)}))}
                style={{width:'100%',padding:'9px 12px',border:'1px solid #e0d8cc',borderRadius:'6px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',boxSizing:'border-box'}} />
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={() => setShowEditRecipeModal(null)} style={{flex:1,padding:'11px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820'}}>Cancel</button>
              <button onClick={async () => {
                const updated = {...showEditRecipeModal, isEasy: showEditRecipeModal.cookTime < 20};
                setUserRecipes(prev => prev.map(r => r.id === updated.id ? updated : r));
                await supabase.from('user_recipes').update({recipe: updated}).eq('user_id', session.user.id).eq('recipe->>id', updated.id);
                setShowEditRecipeModal(null);
              }} style={{flex:2,padding:'11px',background:'#fefcf8',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700,color:'#1c2820'}}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div onClick={() => setShowDeleteConfirm(null)} style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fefcf8',borderRadius:'16px',padding:'28px',maxWidth:'400px',width:'100%',border:'1px solid #e0d8cc',textAlign:'center'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>🗑</div>
            <h2 style={{margin:'0 0 8px 0',fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Delete Recipe?</h2>
            <p style={{margin:'0 0 24px 0',fontSize:'14px',color:'#9a9080'}}>"{showDeleteConfirm.name}" will be permanently removed from your Recipe Book.</p>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{flex:1,padding:'12px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820',fontSize:'14px'}}>Cancel</button>
              <button onClick={async () => {
                const id = showDeleteConfirm.id;
                setUserRecipes(prev => prev.filter(r => r.id !== id));
                updateFolders(prev => prev.map(f => ({...f, recipes: f.recipes.filter(rid => rid !== id)})));
                if (selectedRecipe?.id === id) setSelectedRecipe(null);
                await supabase.from('user_recipes').delete().eq('user_id', session.user.id).eq('recipe->>id', id);
                setShowDeleteConfirm(null);
              }} style={{flex:1,padding:'12px',background:'#c0392b',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700,color:'#1c2820',fontSize:'14px'}}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE TO FOLDER MODAL */}
      {showSaveToFolderModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{background:'#fefcf8',borderRadius:'16px',padding:'24px',maxWidth:'420px',width:'100%',border:'1px solid #e0d8cc'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
              <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Save to Folder</h2>
              <button onClick={() => setShowSaveToFolderModal(null)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
            </div>
            <p style={{margin:'0 0 20px 0',fontSize:'13px',color:'#6a6050'}}>"{showSaveToFolderModal.name}"</p>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',maxHeight:'340px',overflow:'auto'}}>
              {folders.map(folder => {
                const alreadyIn = folder.recipes.includes(showSaveToFolderModal.id);
                return (
                  <button key={folder.id} onClick={() => {
                    if (!alreadyIn) {
                      updateFolders(prev => prev.map(f => f.id === folder.id ? {...f, recipes:[...f.recipes, showSaveToFolderModal.id]} : f));
                    }
                    setShowSaveToFolderModal(null);
                  }}
                    style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:alreadyIn?'#262626':'#141414',border:`1px solid ${alreadyIn?'#51cf66':'#2a2a2a'}`,borderRadius:'10px',cursor:alreadyIn?'default':'pointer',transition:'border-color 0.15s'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                      <span style={{fontSize:'22px'}}>{folder.emoji}</span>
                      <div style={{textAlign:'left'}}>
                        <p style={{margin:0,fontSize:'14px',fontWeight:600,color:'#1c2820'}}>{folder.name}</p>
                        <p style={{margin:0,fontSize:'11px',color:'#6a6050'}}>{folder.recipes.length} recipes</p>
                      </div>
                    </div>
                    {alreadyIn
                      ? <span style={{fontSize:'12px',color:'#5a9a6a',fontWeight:600}}>✓ Saved</span>
                      : <span style={{fontSize:'18px',color:'#7a7060'}}>+</span>
                    }
                  </button>
                );
              })}
              {/* Create new folder shortcut */}
              <button onClick={() => { setShowSaveToFolderModal(null); setShowFolderModal(true); }}
                style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',background:'#f8f5ef',border:'1px dashed #c8c0b4',borderRadius:'10px',cursor:'pointer'}}>
                <span style={{fontSize:'22px'}}>➕</span>
                <p style={{margin:0,fontSize:'14px',fontWeight:600,color:'#6a6050'}}>Create new folder</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE FOLDER MODAL */}
      {showFolderModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div style={{background:'#fefcf8',borderRadius:'16px',padding:'24px',maxWidth:'400px',width:'100%',border:'1px solid #e0d8cc'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
              <h2 style={{margin:0,fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>New Folder</h2>
              <button onClick={() => { setShowFolderModal(false); setNewFolderName(''); setNewFolderEmoji('📁'); }} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
            </div>
            {/* Emoji picker */}
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',marginBottom:'8px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Choose an icon</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'10px'}}>
                {['🍽️','🥗','🍲','🥩','🐟','🥦','🧁','🍕','🌮','🥘','🍜','🥚','🥑','🍋','💪','⚡','🕯️','👶','🏠','📁'].map(e => (
                  <button key={e} onClick={() => setNewFolderEmoji(e)}
                    style={{width:'40px',height:'40px',background:newFolderEmoji===e?'#fff':'#262626',border:newFolderEmoji===e?'2px solid #fff':'2px solid #333',borderRadius:'8px',cursor:'pointer',fontSize:'20px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {e}
                  </button>
                ))}
              </div>
              {/* Custom emoji input */}
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{fontSize:'12px',color:'#6a6050',whiteSpace:'nowrap'}}>Or type your own:</span>
                <input
                  type="text"
                  placeholder="✍️"
                  maxLength={2}
                  value={['🍽️','🥗','🍲','🥩','🐟','🥦','🧁','🍕','🌮','🥘','🍜','🥚','🥑','🍋','💪','⚡','🕯️','👶','🏠','📁'].includes(newFolderEmoji) ? '' : newFolderEmoji}
                  onChange={e => setNewFolderEmoji(e.target.value || newFolderEmoji)}
                  onKeyDown={e => { if (e.key === 'Backspace' || e.key === 'Delete') setNewFolderEmoji('📁'); }}
                  style={{width:'60px',padding:'8px',background:'#f4f0ea',border:'1px solid #d8d0c4',borderRadius:'8px',fontSize:'20px',color:'#1c2820',textAlign:'center',outline:'none',boxSizing:'border-box'}}
                />
              </div>
            </div>
            {/* Folder name */}
            <div style={{marginBottom:'24px'}}>
              <label style={{display:'block',marginBottom:'8px',fontWeight:600,color:'#1c2820',fontSize:'13px'}}>Folder name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="e.g. Sunday Roasts"
                autoFocus
                style={{width:'100%',padding:'11px 14px',border:'1px solid #d8d0c4',borderRadius:'8px',fontSize:'14px',background:'#f4f0ea',color:'#1c2820',outline:'none',boxSizing:'border-box'}}
              />
            </div>
            {/* Preview */}
            {newFolderName.trim() && (
              <div style={{background:'#f0ece4',borderRadius:'10px',padding:'12px 16px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'12px'}}>
                <span style={{fontSize:'26px'}}>{newFolderEmoji}</span>
                <div>
                  <p style={{margin:0,fontSize:'15px',fontWeight:700,color:'#1c2820'}}>{newFolderName}</p>
                  <p style={{margin:0,fontSize:'11px',color:'#6a6050'}}>0 recipes</p>
                </div>
              </div>
            )}
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={() => { setShowFolderModal(false); setNewFolderName(''); setNewFolderEmoji('📁'); }}
                style={{flex:1,padding:'11px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820'}}>Cancel</button>
              <button
                disabled={!newFolderName.trim()}
                onClick={() => {
                  if (!newFolderName.trim()) return;
                  const newFolder = { id: `f${Date.now()}`, name: newFolderName.trim(), emoji: newFolderEmoji, recipes: [] };
                  updateFolders(prev => [...prev, newFolder]);
                  setShowFolderModal(false);
                  setNewFolderName('');
                  setNewFolderEmoji('📁');
                  setActiveFolder(newFolder.id);
                }}
                style={{flex:1,padding:'11px',background:newFolderName.trim()?'#fff':'#333',border:'none',borderRadius:'8px',cursor:newFolderName.trim()?'pointer':'not-allowed',fontWeight:600,color:newFolderName.trim()?'#000':'#666',transition:'all 0.15s'}}>
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEAL PLAN SHARE CARD MODAL */}
      {showMealPlanShare && (
        <div onClick={() => setShowMealPlanShare(false)} style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.92)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px',overflowY:'auto'}}>
          <div onClick={e => e.stopPropagation()} style={{width:'100%',maxWidth:'540px'}}>

            {/* Controls */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <h2 style={{margin:0,fontSize:'20px',fontWeight:600,color:'#fefcf8',fontFamily:"'Cormorant Garamond',serif"}}>📤 Share My Week</h2>
              <button onClick={() => setShowMealPlanShare(false)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22} color="#999" /></button>
            </div>

            {/* THE CARD - this is what gets captured */}
            <div id="meal-plan-card" style={{background:'linear-gradient(135deg, #1c2820 0%, #2c3c2e 50%, #1c2820 100%)',borderRadius:'20px',padding:'28px',border:'1px solid #e0d8cc',fontFamily:"'Jost',sans-serif"}}>
              {/* Card header */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <img src="/logo.png" alt="Logo" style={{width:'80px',height:'80px',objectFit:'contain'}} />
                  <div style={{display:'flex',alignItems:'baseline',gap:'10px',flexWrap:'wrap'}}>
                    <div style={{fontSize:'24px',fontWeight:800,color:'#fefcf8',letterSpacing:'-0.5px'}}>My Weekly Meals</div>
                    <div style={{fontSize:'14px',fontWeight:500,color:'#9a9080'}}>
                      {(() => { const d = getDayDate(0); const e = getDayDate(6); return `${d.getMonth()+1}/${d.getDate()} – ${e.getMonth()+1}/${e.getDate()}`; })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Day rows — vertical list layout */}
              <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
                {daysOfWeek.map((day, dayIndex) => {
                  const colors = {breakfast:'#fbbf24',lunch:'#51cf66',dinner:'#7dd3fc'};
                  const hasMeals = mealTypes.some(mt => mealPlan[dayIndex][mt]);
                  return (
                    <div key={day} style={{display:'flex',alignItems:'flex-start',gap:'8px',background:'rgba(255,255,255,0.04)',borderRadius:'8px',padding:'7px 9px',border:'1px solid rgba(255,255,255,0.06)'}}>
                      {/* Day label */}
                      <div style={{width:'28px',flexShrink:0}}>
                        <div style={{fontSize:'9px',fontWeight:700,color:'#9a9080',textTransform:'uppercase',letterSpacing:'0.4px'}}>{day.slice(0,3)}</div>
                        <div style={{fontSize:'8px',color:'#8a8070',marginTop:'1px'}}>{formatDayDate(dayIndex)}</div>
                      </div>
                      {/* Meals */}
                      <div style={{display:'flex',flexWrap:'wrap',gap:'4px',flex:1}}>
                        {hasMeals ? mealTypes.map(mt => {
                          const recipe = mealPlan[dayIndex][mt];
                          if (!recipe) return null;
                          return (
                            <div key={mt} style={{background:'rgba(255,255,255,0.06)',borderRadius:'5px',padding:'3px 7px',borderLeft:`2px solid ${colors[mt]}`,lineHeight:1.3}}>
                              <span style={{fontSize:'7px',fontWeight:700,color:colors[mt],textTransform:'uppercase',letterSpacing:'0.3px',marginRight:'4px'}}>{mt.slice(0,1).toUpperCase()}</span>
                              <span style={{fontSize:'9px',fontWeight:600,color:'#ddd'}}>{recipe.name.length > 22 ? recipe.name.slice(0,22)+'…' : recipe.name}</span>
                            </div>
                          );
                        }) : (
                          <span style={{fontSize:'9px',color:'#7a8a7c',fontStyle:'italic',paddingTop:'2px'}}>Nothing planned</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card footer */}
              <div style={{marginTop:'16px',paddingTop:'14px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                <span style={{fontSize:'11px',color:'#7a7060'}}>Made with</span>
                <img src="/logo.png" alt="" style={{width:'16px',height:'16px',objectFit:'contain'}} />
                <a href="https://reciperoulette.io" target="_blank" rel="noopener noreferrer" style={{fontSize:'11px',color:'#a78bfa',fontWeight:600,textDecoration:'none'}}>Recipe Roulette</a>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{display:'flex',gap:'10px',marginTop:'16px'}}>
              <button
                onClick={async () => {
                  setGeneratingCard(true);
                  try {
                    // Load html2canvas dynamically
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                    script.onload = async () => {
                      const card = document.getElementById('meal-plan-card');
                      const canvas = await window.html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true });
                      if (navigator.share && navigator.canShare) {
                        canvas.toBlob(async (blob) => {
                          try {
                            const file = new File([blob], 'my-week.png', { type: 'image/png' });
                            await navigator.share({ files: [file], title: 'My Meal Plan', text: 'Check out my meals this week! Made with Recipe Roulette 🍽️' });
                          } catch {
                            // Fallback to download
                            const a = document.createElement('a'); a.download = 'my-week.png'; a.href = canvas.toDataURL(); a.click();
                          }
                          setGeneratingCard(false);
                        });
                      } else {
                        const a = document.createElement('a'); a.download = 'my-week.png'; a.href = canvas.toDataURL(); a.click();
                        setGeneratingCard(false);
                      }
                    };
                    document.head.appendChild(script);
                  } catch { setGeneratingCard(false); }
                }}
                style={{flex:1,padding:'12px',background:'#fefcf8',border:'none',borderRadius:'10px',cursor:'pointer',fontWeight:700,color:'#1c2820',fontSize:'14px'}}
              >
                {generatingCard ? '⏳ Generating...' : (navigator.share ? '📤 Share Image' : '⬇️ Save Image')}
              </button>
              <button onClick={() => setShowMealPlanShare(false)} style={{padding:'12px 18px',background:'#f0ece4',border:'none',borderRadius:'10px',cursor:'pointer',fontWeight:600,color:'#1c2820',fontSize:'14px'}}>
                Close
              </button>
            </div>
            <p style={{textAlign:'center',fontSize:'12px',color:'#7a7060',margin:'10px 0 0 0'}}>Tap Share Image to post to Stories, iMessage, or anywhere</p>
          </div>
        </div>
      )}

      {/* BULK DELETE BAR */}
      {selectionMode && (
        <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#fefcf8',borderTop:'1px solid #e8e0d4',padding:'16px 20px',display:'flex',alignItems:'center',gap:'12px',zIndex:500,boxShadow:'0 -4px 24px rgba(0,0,0,0.5)'}}>
          <span style={{color:'#1c2820',fontWeight:600,fontSize:'14px',flex:1}}>
            {selectedRecipeIds.size > 0 ? `${selectedRecipeIds.size} selected` : 'Long press to select'}
          </span>
          {selectedRecipeIds.size > 0 && (
            <button onClick={() => setShowBulkDeleteConfirm(true)}
              style={{padding:'10px 20px',background:'#c0392b',border:'none',borderRadius:'8px',fontWeight:700,fontSize:'14px',color:'#1c2820',cursor:'pointer'}}>
              🗑 Delete {selectedRecipeIds.size}
            </button>
          )}
          <button onClick={() => { setSelectionMode(false); setSelectedRecipeIds(new Set()); }}
            style={{padding:'10px 16px',background:'#f0ece4',border:'none',borderRadius:'8px',fontWeight:600,fontSize:'14px',color:'#1c2820',cursor:'pointer'}}>
            Cancel
          </button>
        </div>
      )}

      {/* BULK DELETE CONFIRM */}
      {showBulkDeleteConfirm && (
        <div onClick={() => setShowBulkDeleteConfirm(false)} style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.9)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:600,padding:'20px'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fefcf8',borderRadius:'16px',padding:'28px',maxWidth:'380px',width:'100%',border:'1px solid #e0d8cc',textAlign:'center'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>🗑</div>
            <h2 style={{margin:'0 0 8px 0',fontSize:'22px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif"}}>Delete {selectedRecipeIds.size} {selectedRecipeIds.size === 1 ? 'Recipe' : 'Recipes'}?</h2>
            <p style={{margin:'0 0 24px 0',fontSize:'14px',color:'#9a9080'}}>This will permanently remove them from your Recipe Book and all folders.</p>
            <div style={{display:'flex',gap:'10px'}}>
              <button onClick={() => setShowBulkDeleteConfirm(false)} style={{flex:1,padding:'12px',background:'#f0ece4',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600,color:'#1c2820',fontSize:'14px'}}>Cancel</button>
              <button onClick={async () => {
                const ids = [...selectedRecipeIds];
                setUserRecipes(prev => prev.filter(r => !ids.includes(r.id)));
                updateFolders(prev => prev.map(f => ({...f, recipes: f.recipes.filter(rid => !ids.includes(rid))})));
                for (const id of ids) {
                  await supabase.from('user_recipes').delete().eq('user_id', session.user.id).eq('recipe->>id', id);
                }
                setShowBulkDeleteConfirm(false);
                setSelectionMode(false);
                setSelectedRecipeIds(new Set());
              }} style={{flex:1,padding:'12px',background:'#c0392b',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:700,color:'#1c2820',fontSize:'14px'}}>
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}


      {/* RECIPE DETAIL MODAL */}
      {selectedRecipe && (
        <div onClick={() => setSelectedRecipe(null)} style={{position:'fixed',inset:0,background:'rgba(20,30,22,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'20px'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'#fefcf8',borderRadius:'12px',maxWidth:'720px',width:'100%',maxHeight:'90vh',overflow:'auto',border:'1px solid #e0d8cc'}}>
            {selectedRecipe.image
              ? <div style={{height:'240px',backgroundImage:`url(${selectedRecipe.image})`,backgroundSize:'cover',backgroundPosition:'center',position:'relative',borderRadius:'12px 12px 0 0'}}>
                  <button onClick={() => setSelectedRecipe(null)} style={{position:'absolute',top:'12px',right:'12px',background:'rgba(0,0,0,0.7)',border:'none',borderRadius:'50%',width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><X size={18} color="white" /></button>
                </div>
              : <div style={{height:'140px',background:'#f0ece4',borderRadius:'12px 12px 0 0',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',borderBottom:'1px solid #e8e0d4'}}>
                  <p style={{margin:0,fontSize:'28px',fontWeight:600,color:'#1c2820',fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',textAlign:'center',padding:'0 24px',lineHeight:1.2}}>{selectedRecipe.name}</p>
                  <button onClick={() => setSelectedRecipe(null)} style={{position:'absolute',top:'12px',right:'12px',background:'rgba(0,0,0,0.7)',border:'none',borderRadius:'50%',width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><X size={18} color="white" /></button>
                </div>
            }
            <div style={{padding:'24px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                <div>
                  <h2 style={{margin:'0 0 8px 0',fontSize:isMobile?'20px':'26px',fontWeight:700,color:'#1c2820'}}>{selectedRecipe.name}</h2>
                  <RatingDisplay recipeId={selectedRecipe.id} />
                </div>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'flex-end',marginLeft:'8px'}}>
                  <button onClick={() => { setShowRatingModal(selectedRecipe); }} style={{padding:'7px 12px',background:userRatings[selectedRecipe.id]?'#1a1a1a':'#262626',border:'1px solid #d8d0c4',borderRadius:'8px',fontWeight:600,fontSize:'12px',cursor:'pointer',color:userRatings[selectedRecipe.id]?'#fbbf24':'#999',whiteSpace:'nowrap'}}>
                    {userRatings[selectedRecipe.id] ? `★ ${userRatings[selectedRecipe.id].rating}` : '☆ Rate'}
                  </button>
                  <button onClick={() => { setShowSaveToFolderModal(selectedRecipe); setSelectedRecipe(null); }} style={{padding:'7px 12px',background:'#fefcf8',border:'1px solid #d8d0c4',borderRadius:'8px',fontWeight:600,fontSize:'12px',cursor:'pointer',color:'#1c2820',whiteSpace:'nowrap'}}>
                    🗂 Folder
                  </button>
                  <button onClick={() => { setShowAddToCalendar(selectedRecipe); setSelectedRecipe(null); }} style={{padding:'7px 12px',background:'#fefcf8',border:'none',borderRadius:'8px',fontWeight:600,fontSize:'12px',cursor:'pointer',color:'#1c2820',whiteSpace:'nowrap'}}>
                    + Calendar
                  </button>

                </div>
              </div>
              {userRecipes.find(r => r.id === selectedRecipe.id) && (
                <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
                  <button onClick={async () => {
                    const updated = {...selectedRecipe, timesMade: (selectedRecipe.timesMade || 0) + 1};
                    setUserRecipes(prev => prev.map(r => r.id === updated.id ? updated : r));
                    setSelectedRecipe(updated);
                    await supabase.from('user_recipes').update({recipe: updated}).eq('user_id', session.user.id).eq('recipe->>id', updated.id);
                  }} style={{flex:'1 1 auto',padding:'9px 14px',background:'#fefcf8',border:'1px solid #d8d0c4',borderRadius:'8px',fontWeight:600,fontSize:'13px',cursor:'pointer',color:'#5a9a6a'}}>
                    ✅ Made It! ({selectedRecipe.timesMade || 0}x)
                  </button>
                  <button onClick={() => { setShowEditRecipeModal(selectedRecipe); setSelectedRecipe(null); }} style={{flex:'1 1 auto',padding:'9px 14px',background:'#fefcf8',border:'1px solid #d8d0c4',borderRadius:'8px',fontWeight:600,fontSize:'13px',cursor:'pointer',color:'#2a3a7a'}}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => { setShowDeleteConfirm(selectedRecipe); setSelectedRecipe(null); }} style={{flex:'1 1 auto',padding:'9px 14px',background:'#fefcf8',border:'1px solid #d8d0c4',borderRadius:'8px',fontWeight:600,fontSize:'13px',cursor:'pointer',color:'#c46a3a'}}>
                    🗑 Delete
                  </button>
                </div>
              )}
              <div style={{display:'flex',gap:'18px',marginBottom: selectedRecipe.sourceUrl ? '10px' : '20px',fontSize:'13px',color:'#9a9080',flexWrap:'wrap'}}>
                <span>⏱ {selectedRecipe.prepTime}</span>
                <span>🍽 {profile.householdSize || selectedRecipe.servings} servings{profile.householdSize && selectedRecipe.servings && profile.householdSize !== selectedRecipe.servings ? ` (scaled from ${selectedRecipe.servings})` : ''}</span>
                {selectedRecipe.timesMade !== undefined && <span>Made {selectedRecipe.timesMade}x</span>}
              </div>
              {selectedRecipe.sourceUrl && (
                <div style={{marginBottom:'20px'}}>
                  <a href={selectedRecipe.sourceUrl} target="_blank" rel="noopener noreferrer"
                    style={{fontSize:'12px',color:'#2a3a7a',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'5px',background:'#f4f0ea',padding:'6px 12px',borderRadius:'6px',border:'1px solid #e0d8cc'}}>
                    🔗 View original recipe at {selectedRecipe.sourceUrl.replace(/^https?:\/\/(www\.)?/,'').split('/')[0]}
                  </a>
                </div>
              )}
              {selectedRecipe.ingredients && (<>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'0 0 8px 0'}}>
                  <h3 style={{margin:0,fontSize:'15px',fontWeight:700,color:'#1c2820'}}>Ingredients</h3>
                  {selectedRecipe.servings && (
                    <span style={{fontSize:'12px',color: profile.householdSize !== selectedRecipe.servings ? '#fcc419' : '#666',fontWeight:600}}>
                      {profile.householdSize !== selectedRecipe.servings
                        ? `Scaled for ${profile.householdSize || 2} people (orig. ${selectedRecipe.servings})`
                        : `Serves ${selectedRecipe.servings}`}
                    </span>
                  )}
                </div>
                <ul style={{marginBottom:'18px',paddingLeft:'18px'}}>
                  {selectedRecipe.ingredients.map((ing,i) => {
                    const ratio = selectedRecipe.servings ? (profile.householdSize || 2) / selectedRecipe.servings : 1;
                    const scaled = scaleIngredient(ing, ratio);
                    const changed = scaled !== ing;
                    return <li key={i} style={{marginBottom:'5px',color: changed ? '#fff' : '#999',lineHeight:1.5}}>{scaled}</li>;
                  })}
                </ul>
              </>)}
              {selectedRecipe.instructions && (<>
                <h3 style={{margin:'0 0 4px 0',fontSize:'15px',fontWeight:700,color:'#1c2820'}}>Instructions</h3>
                {selectedRecipe.servings && profile.householdSize && profile.householdSize !== selectedRecipe.servings && (
                  <p style={{margin:'0 0 10px',fontSize:'12px',color:'#fcc419'}}>⚠ Ingredients above are scaled for {profile.householdSize} — adjust cooking vessel sizes accordingly.</p>
                )}
                {Array.isArray(selectedRecipe.instructions) ? (
                  <ol style={{paddingLeft:'18px'}}>
                    {selectedRecipe.instructions.map((step,i) => {
                      const ratio = selectedRecipe.servings ? (profile.householdSize || 2) / selectedRecipe.servings : 1;
                      const scaledStep = scaleIngredient(step, ratio);
                      return <li key={i} style={{marginBottom:'8px',color:'#9a9080',lineHeight:1.6}}>{scaledStep}</li>;
                    })}
                  </ol>
                ) : <p style={{color:'#9a9080'}}>{selectedRecipe.instructions}</p>}
              </>)}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const shareId = params.get('r');
  const joinCode = params.get('join');
  const krogerCode = params.get('code');
  const krogerState = params.get('state');

  if (krogerCode && krogerState) {
    const savedState = sessionStorage.getItem('kroger_oauth_state');
    // Be lenient — mobile browsers sometimes lose sessionStorage across redirects
    if (krogerState === savedState || savedState === null) {
      const KROGER_CLIENT_ID = 'thereciperoulette-bbcc09pc';
      const KROGER_CLIENT_SECRET = 'KIJMvRMbsD0cf19lnsiU06SCp3pzlh0-_3eofy1K';
      const KROGER_REDIRECT_URI = 'https://reciperoulette.io/auth/callback';
      const credentials = btoa(`${KROGER_CLIENT_ID}:${KROGER_CLIENT_SECRET}`);
      fetch('https://reciperoulette.io/api/kroger-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: krogerCode, redirect_uri: KROGER_REDIRECT_URI })
      })
      .then(r => r.json())
      .then(data => {
        if (data.access_token) {
          // Use localStorage — survives cross-origin redirects on mobile unlike sessionStorage
          localStorage.setItem('kroger_access_token', data.access_token);
          localStorage.setItem('kroger_add_to_cart', 'true');
          const pending = sessionStorage.getItem('kroger_pending_ingredients');
          const zip = sessionStorage.getItem('kroger_zip');
          if (pending) localStorage.setItem('kroger_pending_ingredients', pending);
          if (zip) localStorage.setItem('kroger_zip', zip);
        }
        sessionStorage.removeItem('kroger_oauth_state');
        window.history.replaceState({}, '', '/');
        window.location.href = '/';
      })
      .catch(err => {
        window.history.replaceState({}, '', '/');
        window.location.href = '/';
      });
      return (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#fefcf8',fontFamily:"'Jost',sans-serif"}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'40px',marginBottom:'16px'}}>🛒</div>
            <p style={{fontWeight:600,fontSize:'16px',color:'#1c2820'}}>Connecting to Kroger...</p>
            <p style={{fontSize:'13px',color:'#8a7a6a',marginTop:'8px'}}>Adding your items to cart</p>
          </div>
        </div>
      );
    }
  }

  if (shareId) return <SharedRecipeView shareId={shareId} />;
  return <MealPrepApp pendingJoinCode={joinCode} />;
};

export default App;
