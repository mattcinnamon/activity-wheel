// Mission data for each category
// Bristol-specific: harbour, Leigh Woods, parks, Clifton, Brunel's SS Great Britain area

const missions = {
  explore: [
    {
      title: "Leaf Hunt",
      description: "Go outdoors and find three different kinds of leaves. Bring them home, stick them on paper, and write their names with your Big Person's help!",
    },
    {
      title: "Harbour Adventure",
      description: "Go to the harbour and spot three different types of boat and two types of bird. Take pictures and print them for your Explore scrapbook!",
    },
    {
      title: "Bug Safari",
      description: "Go to the park with a magnifying glass. Find three different creepy-crawlies hiding under rocks or logs. Draw pictures of what you find!",
    },
    {
      title: "Cloud Spotter",
      description: "Lie on a blanket outside and look at the clouds. Can you find shapes that look like animals? Draw three cloud animals when you get home!",
    },
    {
      title: "Colour Walk",
      description: "Go for a walk and try to find something in nature for every colour of the rainbow. Collect safe items or take pictures!",
    },
    {
      title: "Puddle Patrol",
      description: "Put on your wellies and find puddles! Splash, measure how deep they are with a stick, and drop leaves in to make boats!",
    },
    {
      title: "Texture Explorer",
      description: "Find five things outside that feel different - smooth, rough, soft, bumpy, sticky. Make rubbings with paper and crayons!",
    },
    {
      title: "Sound Detective",
      description: "Sit quietly in the park for two minutes. How many different sounds can you hear? Birds? Wind? Dogs? Count them all!",
    },
    {
      title: "Shadow Catcher",
      description: "On a sunny day, trace your shadow with chalk on the pavement. Come back later - has it moved? Draw it again!",
    },
    {
      title: "Rock Collection",
      description: "Find five interesting rocks on your walk. Wash them at home, paint faces on them, and give each rock a name!",
    },
    {
      title: "Flower Spotter",
      description: "How many different coloured flowers can you find in your neighbourhood? Draw each one and try to find out its name!",
    },
    {
      title: "Bridge Counter",
      description: "Walk along the harbour and count all the bridges you can see! Take a photo on each one and make a bridge book!",
    },
  ],

  experiment: [
    {
      title: "Volcano Fizz!",
      description: "Make a volcano with baking soda and vinegar! Build a mountain from playdough, add baking soda inside, then pour in vinegar and watch it erupt!",
    },
    {
      title: "Magic Milk",
      description: "Pour milk in a plate, add drops of food colouring, then touch it with a cotton bud dipped in washing-up liquid. Watch the colours dance!",
    },
    {
      title: "Sink or Float?",
      description: "Fill a bowl with water. Collect toys and kitchen items. Guess which ones will sink and which will float, then test them!",
    },
    {
      title: "Rainbow Walk",
      description: "Put white kitchen paper in a glass of water with food colouring. Watch the colour walk up the paper like magic! Try different colours!",
    },
    {
      title: "Bread Chewing Science",
      description: "Chew a piece of bread for a really long time. Does it start tasting sweet? That's your mouth's special helpers turning bread into sugar!",
    },
    {
      title: "Ice Rescue",
      description: "Freeze small toys in a container of water. Use warm water, salt, and tools to rescue the toys from the ice!",
    },
    {
      title: "Raisin Dancers",
      description: "Drop raisins into a glass of fizzy water and watch them dance up and down! The bubbles carry them up like tiny lifts!",
    },
    {
      title: "Magnet Explorer",
      description: "Take a magnet around the house. What sticks? What doesn't? Sort your findings into two groups and talk about why!",
    },
    {
      title: "Colour Mixing",
      description: "With just red, yellow, and blue paint, try to make as many new colours as you can. What happens when you mix them all together?",
    },
    {
      title: "Seed Grower",
      description: "Put a wet cotton ball in a clear cup and press a bean seed against the side. Watch it sprout roots and leaves over the next week!",
    },
    {
      title: "Sound Shakers",
      description: "Fill containers with rice, pasta, beans, and sand. Shake them! Which is loudest? Quietest? Can you put them in order?",
    },
    {
      title: "Static Hair",
      description: "Rub a balloon on your jumper and hold it near your hair. What happens? Try it near tiny bits of paper too!",
    },
  ],

  dance: [
    {
      title: "Animal Dance Party",
      description: "Put on your favourite song and dance like different animals! Stomp like an elephant, hop like a bunny, slither like a snake!",
    },
    {
      title: "Freeze Dance",
      description: "Play music and dance as wildly as you can. When the music stops - FREEZE! Hold your pose like a statue. Can your Big Person catch you moving?",
    },
    {
      title: "Scarf Dancing",
      description: "Grab a scarf or ribbon and put on some music. Make it flow and swirl. Try fast music and slow music - how does your scarf dance change?",
    },
    {
      title: "Copy Cat Moves",
      description: "Take turns with your Big Person. One person does a dance move, the other copies it. Keep adding moves to make a longer and longer dance!",
    },
    {
      title: "Bubble Dance",
      description: "Someone blows bubbles while you dance to pop them! Try to pop them with different body parts - elbows, knees, nose!",
    },
    {
      title: "Slow Mo Disco",
      description: "Try dancing in super slow motion like you're moving through jelly! Then speed up as fast as you can! Slow... fast... slow... fast!",
    },
    {
      title: "Musical Feelings",
      description: "Play different types of music - happy, gentle, bouncy, dramatic. How does each one make you want to move? Show the feeling!",
    },
    {
      title: "Dance Story",
      description: "Make up a dance that tells a story! Maybe you're a seed growing into a flower, or a rocket launching into space. Show it to your family!",
    },
    {
      title: "Shadow Dance",
      description: "Shine a torch on the wall and dance to make your shadow move! Can you make your shadow look like it's flying?",
    },
    {
      title: "Rhythm Maker",
      description: "Clap a pattern and stomp your feet to match. Can you make a beat? Tap your knees, clap your hands, stomp your feet - make your own song!",
    },
  ],

  puzzle: [
    {
      title: "Shape Hunter",
      description: "Walk around your home and find circles, squares, triangles, and rectangles. How many of each can you find? Draw a map of where they are!",
    },
    {
      title: "Matching Pairs",
      description: "Collect pairs of socks and mix them up. Can you find all the matching pairs? Time yourself and try to beat your record!",
    },
    {
      title: "Pattern Builder",
      description: "Use coloured blocks, buttons, or fruit to make a pattern. Red-blue-red-blue. Can you make a harder pattern? Can your Big Person guess what comes next?",
    },
    {
      title: "Sorting Challenge",
      description: "Grab a handful of different items. Sort them by colour, then by size, then by shape. How many different ways can you sort the same things?",
    },
    {
      title: "Treasure Map",
      description: "Your Big Person hides a toy and draws a simple map with clues. Follow the map to find the treasure! Then make a map for them!",
    },
    {
      title: "What's Missing?",
      description: "Put five toys on a tray. Look carefully, then close your eyes. Your Big Person takes one away. Can you spot what's missing? Add more toys to make it harder!",
    },
    {
      title: "Counting Quest",
      description: "How many steps from your bedroom to the kitchen? How many spoons in the drawer? How many books on the shelf? Count everything!",
    },
    {
      title: "Story Sequencing",
      description: "Draw three pictures that tell a story - beginning, middle, and end. Mix them up and put them back in the right order!",
    },
    {
      title: "Mirror Puzzle",
      description: "Your Big Person makes a shape or pattern with blocks on one side. You try to build the exact mirror image on the other side!",
    },
    {
      title: "Odd One Out",
      description: "Your Big Person puts out groups of things where one doesn't belong. A fork among spoons! A red block among blue ones! Find the odd one out!",
    },
  ],

  build: [
    {
      title: "Tallest Tower",
      description: "How tall can you build a tower with Duplo? Measure it against yourself! Can you make it taller than your tummy? Your shoulders? Your head?",
    },
    {
      title: "Animal House",
      description: "Build a home for your favourite toy animal using Duplo or Magnetiles. It needs a door, a window, and a roof. Give your animal a tour!",
    },
    {
      title: "Bridge Builder",
      description: "Build a bridge with Magnetiles or Duplo that a toy car can drive under. Make it as long as you can without it falling down!",
    },
    {
      title: "Castle Creator",
      description: "Build a castle with towers and walls. Use Duplo for the base and Magnetiles for the roofs. Who lives in your castle?",
    },
    {
      title: "Marble Run",
      description: "Use cardboard tubes, boxes, and tape to make a ramp for a ball or marble. How far can you make it roll? Add twists and turns!",
    },
    {
      title: "Robot Friend",
      description: "Build a robot from boxes, cups, and tape. Give it a name, draw its face, and tell everyone what your robot can do!",
    },
    {
      title: "Train Track Town",
      description: "Build a track and then build a whole town around it with blocks. Add houses, a shop, a park, and a station!",
    },
    {
      title: "Blanket Fort",
      description: "Build a cozy den using cushions, blankets, and chairs. Bring in books, a torch, and a snack. Read a story in your fort!",
    },
    {
      title: "Boat Builder",
      description: "Make a boat from foil, cork, or a plastic tub. Test it in the bath or a bowl of water. Can it carry small toys without sinking?",
    },
    {
      title: "Magnetic Shapes",
      description: "Use Magnetiles to make flat shapes on the floor - a star, a house, a flower. Then fold them up into 3D! What does your flat shape become?",
    },
  ],

  paint: [
    {
      title: "Handprint Animals",
      description: "Dip your hands in paint and make handprints. Turn them into animals - a handprint can become a peacock, a tree, an octopus! How many can you make?",
    },
    {
      title: "Blow Painting",
      description: "Drop watery paint onto paper and blow it with a straw to make wild patterns. Use different colours and see what creatures or trees you can see in the splatters!",
    },
    {
      title: "Nature Art",
      description: "Collect leaves, sticks, and petals from outside. Arrange them into a picture on a piece of card and stick them down. A leaf butterfly? A stick person?",
    },
    {
      title: "Bubble Wrap Stamping",
      description: "Wrap bubble wrap around a rolling pin or your hand. Dip it in paint and stamp it on paper for amazing textures! Make a bubble wrap caterpillar!",
    },
    {
      title: "Colour Mixing Magic",
      description: "Start with only red, yellow, and blue. Paint a picture using only colours you mix yourself. How many new colours can you create?",
    },
    {
      title: "Self Portrait",
      description: "Look in a mirror. What colour are your eyes? Your hair? Paint a big picture of yourself. Don't forget your favourite outfit!",
    },
    {
      title: "Sponge Painting",
      description: "Cut sponges into shapes - stars, circles, hearts. Dip them in paint and stamp a pattern. Make wrapping paper for someone special!",
    },
    {
      title: "Rainy Day Art",
      description: "Put drops of food colouring on paper and leave it in the rain for a few minutes. Watch the rain make art! Bring it inside to dry.",
    },
    {
      title: "Playdough Creations",
      description: "Make your own playdough (flour, salt, water, oil) with your Big Person. Shape it into your favourite animals and paint them when they dry!",
    },
    {
      title: "Collage Creation",
      description: "Cut or tear up old magazines, coloured paper, and fabric scraps. Glue them together to make a picture. Tell the story of your collage!",
    },
    {
      title: "Pasta Jewellery",
      description: "Paint pasta tubes in bright colours. When they're dry, thread them onto string to make necklaces and bracelets for everyone!",
    },
    {
      title: "Finger Painting Feelings",
      description: "Use your fingers (no brushes!) to paint how you're feeling today. Happy might be bright yellows and swirls! What does excited look like?",
    },
  ],
};

export default missions;
