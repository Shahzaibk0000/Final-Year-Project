import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

function formatPatientAdmissionDate(dateString) {
  if (!dateString) {
    return null;
  }

  const date = dayjs(dateString, "YYYY-MM-DD");
  if (!date.isValid()) {
    return null;
  }

  // Ensure only the date part is returned without time
  const formattedDate = date.format("DD/MM/YYYY");

  return formattedDate;
}

function formatDate(dateString) {
  if (!dateString) {
    return null;
  }
  if (!dateString.includes("T")) {
    return null;
  }
  const date = dayjs(dateString);
  if (!date.isValid()) {
    return null;
  }
  return date.format("DD/MM/YYYY");
}

function formatDatetoWordDate(dateString) {
  if (!dateString) {
    return null;
  }
  const date = dayjs(dateString);
  if (!date.isValid()) {
    return null;
  }
  return date.format("D MMMM YYYY");
}

const userType = {
  superAdmin: "Super Administrator",
  provinceAdmin: "Province Administrator",
  divisionAdmin: "Division Administrator",
  districtAdmin: "District Administrator",
  tehsilAdmin: "Tehsil Administrator",
  hospitalAdmin: "Hospital Administrator",
};

function getAreaIdByUserType(user) {
  if (user.userType === userType.superAdmin) {
    return 1000;
  } else if (user.userType === userType.provinceAdmin) {
    return user.province.id;
  } else if (user.userType === userType.divisionAdmin) {
    return user.division.id;
  } else if (user.userType === userType.districtAdmin) {
    return user.district.id;
  } else if (user.userType === userType.tehsilAdmin) {
    return user.tehsil.id;
  } else if (user.userType === userType.hospitalAdmin) {
    return user.hospital.id;
  }
  return 0;
}

function getTabIndices(userType) {
  switch (userType) {
    case "Super Administrator":
      return { province: 0, division: 1, district: 2, tehsil: 3, hospital: 4 };
    case "Province Administrator":
      return { division: 0, district: 1, tehsil: 2, hospital: 3 };
    case "Division Administrator":
      return { district: 0, tehsil: 1, hospital: 2 };
    case "District Administrator":
      return { tehsil: 0, hospital: 1 };
    case "Tehsil Administrator":
      return { hospital: 0 };
    case "Hospital Administrator":
      return { hospital: 0 };
    default:
      return {};
  }
}
const CompareObject = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};
const getPictureBase64 = (defaultImage) => {
  return new Promise((resolve, reject) => {
    if (!(defaultImage instanceof Blob)) {
      reject(new TypeError("Parameter 1 is not of type 'Blob'"));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(defaultImage);
  });
};
const fetchImageAsBlob = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
};

export {
  formatDate,
  formatPatientAdmissionDate,
  formatDatetoWordDate,
  getTabIndices,
  userType,
  getAreaIdByUserType,
  CompareObject,
  getPictureBase64,
  fetchImageAsBlob,
};
