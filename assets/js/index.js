$(document).ready(function () {
  //scroll to certain technology specific project
  $(".nav-icon").click((e) => {
    if (e.target.id == "python") {
      thumbnailSelect($("#fuji-thumbnail"), $("#fuji-content"));
    } else if (e.target.id == "css") {
      thumbnailSelect($("#creature-thumbnail"), $("#creature-content"));
    } else if (e.target.id == "html") {
      thumbnailSelect($("#static-thumbnail"), $("#static-content"));
    } else if (e.target.id == "js") {
      thumbnailSelect($("#game-thumbnail"), $("#game-content"));
    } else if (e.target.id == "database") {
      thumbnailSelect($("#fuji-thumbnail"), $("#fuji-content"));
    }
  });

  //open project descriptions
  $(".creature-thumbnail").click(() => {
    thumbnailSelect($("#creature-thumbnail"), $("#creature-content"));
  });

  $("#fuji-thumbnail").click(() => {
    thumbnailSelect($("#fuji-thumbnail"), $("#fuji-content"));
  });

  $(".static-thumbnail").click(() => {
    thumbnailSelect($("#static-thumbnail"), $("#static-content"));
  });

  $(".api-thumbnail").click(() => {
    thumbnailSelect($("#api-thumbnail"), $("#api-content"));
  });

  $(".device-thumbnail").click(() => {
    thumbnailSelect($("#device-thumbnail"), $("#device-content"));
  });

  $(".serverless-thumbnail").click(() => {
    thumbnailSelect($("#serverless-thumbnail"), $("#serverless-content"));
  });

  $(".game-thumbnail").click(() => {
    thumbnailSelect($("#game-thumbnail"), $("#game-content"));
  });

  //open contact modal
  $(".contact-me").click(() => {
    $("#contactModal").modal("toggle");
  });

  //Carousel delay

  $("#deviceCarousel").carousel({
    interval: 10000,
  });

  //=============================================
  //Thumbnail logic
  //=============================================
  const thumbnailSelect = (thumbnail, content) => {
    $(".thumbnail").each(function () {
      if ($(this)[0].id === thumbnail[0].id) {
        $(this).addClass("selected");
        localStorage.setItem("selected-thumbnail", $(this)[0].id);
      } else {
        $(this).removeClass("selected");
      }
    });

    $(".thumbnail-content").each(function () {
      if ($(this)[0].id === content[0].id) {
        $(this).addClass("show");
        localStorage.setItem("thumbnail-content", $(this)[0].id);
      } else {
        $(this).removeClass("show");
      }
    });
  };

  const loadLastThumbnail = (thumbnail, content) => {
    $(".thumbnail").each(function () {
      if ($(this)[0].id === thumbnail) {
        $(this).addClass("selected");
      } else {
        $(this).removeClass("selected");
      }
    });

    $(".thumbnail-content").each(function () {
      if ($(this)[0].id === content) {
        $(this).addClass("show");
      } else {
        $(this).removeClass("show");
      }
    });
  };

  // Open last selected thumbnail
  const getSelectedThumbnail = () => {
    let thumbnail = localStorage.getItem("selected-thumbnail") || false;
    let content = localStorage.getItem("thumbnail-content") || false;

    if (thumbnail && content) loadLastThumbnail(thumbnail, content);
  };

  window.addEventListener("load", getSelectedThumbnail);

  //=============================================
  //Auto-Scroll logic on load
  //=============================================
  // Save Y Offset Position to localStorage
  const recordVerticalOffset = () => {
    localStorage.setItem("pageVerticalPosition", window.scrollY);
  };

  // Only save window position after scrolling stops
  const throttleScroll = (recordVerticalOffset, delay) => {
    let time = Date.now();

    return () => {
      if (time + delay - Date.now() < 0) {
        recordVerticalOffset();
        time = Date.now();
      }
    };
  };

  // Scroll Event Listener
  window.addEventListener("scroll", throttleScroll(recordVerticalOffset, 1000));

  // DESTINATION PAGE
  // ================

  const repositionPage = () => {
    let tab = localStorage.getItem("selected-thumbnail") || false;
    let pageVerticalPosition =
      tab === "api-thumbnail"
        ? localStorage.getItem("pageVerticalPosition") || 0
        : 0;

    window.scrollTo(0, pageVerticalPosition);
  };

  window.addEventListener("load", repositionPage);

  //=============================================
  // Paginate Thumbnails
  //=============================================
  //breakpoints
  let xxl = 1700;
  let xl = 1400;
  let lg = 1125;
  let md = 935;
  let sm = 740;
  let xs = 575;

  //resize thumbnails
  function thumbnailResize() {
    //set number of thumbnails depending on window width
    if (window.innerWidth > xxl) {
      numThumbnails = 7;
    } else if (window.innerWidth < xxl && window.innerWidth > xl) {
      numThumbnails = 6;
    } else if (window.innerWidth < xl && window.innerWidth > lg) {
      numThumbnails = 5;
    } else if (window.innerWidth < lg && window.innerWidth > md) {
      numThumbnails = 4;
    } else if (window.innerWidth < md && window.innerWidth > sm) {
      numThumbnails = 3;
    } else if (window.innerWidth < sm && window.innerWidth > xs) {
      numThumbnails = 2;
    } else {
      numThumbnails = 1;
    }

    //hide groups if groups are created
    if (groups.length > 0) hideGroup(grpIndex);

    //create groups
    createGroups(numThumbnails);

    //get selected index
    getSelectedIndex();

    //display current pageable dots
    if (groups.length > 0) createDots(grpIndex);

    //show group being indexed
    if (groups.length > 0) showGroup(grpIndex);
  }

  //init groups and group index
  let groups = [];
  let grpIndex = 0;

  //html elements
  const insertDots = document.getElementById("pageable-dots");
  const prevArrow = $("#prev-thumbnails");
  const nextArrow = $("#next-thumbnails");

  thumbnailResize();

  function createGroups(numThumbnails) {
    groups = [];
    //paginate project thumbnails
    if ($(".thumbnail").length > numThumbnails) {
      //get thumbnails
      let thumbnails = [...document.querySelectorAll(".thumbnail")];

      //populate group arrays
      for (let i = 0; i < thumbnails.length; i += numThumbnails) {
        i =
          i + numThumbnails > thumbnails.length
            ? thumbnails.length - numThumbnails
            : i;
        groups.push(thumbnails.slice(i, numThumbnails + i));
      }

      //add arrows
      $("#prev-arrow-insert").append(prevArrow);
      $("#next-arrow-insert").append(nextArrow);
    } else {
      //clean up and delete pagination items
      while (insertDots.firstChild) {
        insertDots.removeChild(insertDots.firstChild);
      }
      prevArrow.remove();
      nextArrow.remove();
      $(".thumbnail").addClass("show");
    }
  }

  function showGroup(grpIndex) {
    for (i of groups[grpIndex]) {
      document.getElementById(i.id).classList.add("show");
    }
  }

  function hideGroup(grpIndex) {
    for (i of groups[grpIndex]) {
      document.getElementById(i.id).classList.remove("show");
    }
  }

  function getSelectedIndex() {
    let selected = localStorage.getItem("selected-thumbnail") || false;

    //loop thru groups and find first group with selected id
    for (group in groups) {
      groups[group].forEach((element) => {
        if (element.id == selected) {
          grpIndex = parseInt(group);
          return;
        }
      });
    }
  }

  function createDots(grpIndex) {
    //delete current dots
    while (insertDots.firstChild) {
      insertDots.removeChild(insertDots.firstChild);
    }

    //create the same amount of dots as there are groups
    for (i in groups) {
      const dot = document.createElement("div");
      dot.id = `dot-${i}`;
      dot.className = i == grpIndex ? "dot grow selected" : "dot grow";
      insertDots.appendChild(dot);
    }
  }

  function updateDots(lastIndex, newIndex) {
    $(`#dot-${lastIndex}`).removeClass("selected");
    $(`#dot-${newIndex}`).addClass("selected");
  }

  //click on a dot and update selected group/dot
  $(document).on("click", ".dot", (e) => {
    //last group index
    let last = grpIndex;

    //hide last group
    hideGroup(last);

    //get target group
    grpIndex = parseInt(e.target.id.split("-")[1]);

    //update dots and show gorup
    updateDots(last, grpIndex);
    showGroup(grpIndex);
  });

  //click on arrow and show next group/dot
  $(document).on("click", "#next-thumbnails", (e) => {
    if (grpIndex + 1 < groups.length) {
      //hide last group
      hideGroup(grpIndex);

      //update dots
      updateDots(grpIndex, grpIndex + 1);

      //increase group index and show next group
      grpIndex++;
      showGroup(grpIndex);
    }
  });

  //click on arrow and show previous group/dot
  $(document).on("click", "#prev-thumbnails", (e) => {
    if (grpIndex - 1 >= 0) {
      //hide last group
      hideGroup(grpIndex);

      //update dots
      updateDots(grpIndex, grpIndex - 1);

      //decrease group index and show previous group
      grpIndex--;
      showGroup(grpIndex);
    }
  });

  window.addEventListener("resize", thumbnailResize);
});
