// Assignment data structure for AI Assistant
const assignmentsData = {
    "gravitation": {
        title: "Gravitation",
        subject: "Physics",
        teacher: "SKG SIR",
        dueDate: "Tomorrow",
        description: "Solve numerical problems from Chapter 2: Motion in a Plane (Q. No. 1–10 of your textbook). Derive the equation for centripetal force.",
        goals: [
            "Understand the concept of centripetal force",
            "Practice solving numerical problems related to circular motion",
            "Learn to derive mathematical equations for physical concepts",
            "Apply knowledge from Chapter 2: Motion in a Plane"
        ],
        topics: [
            "Circular motion",
            "Centripetal force",
            "Motion in a plane",
            "Numerical problem solving"
        ],
        difficulty: "Intermediate",
        estimatedTime: "2-3 hours"
    },
    "organic": {
        title: "Organic",
        subject: "Chemistry",
        teacher: "JRG sir",
        dueDate: "Due in 3 days",
        description: "Write the IUPAC name of 10 blah blah",
        goals: [
            "Learn IUPAC naming conventions",
            "Practice naming organic compounds",
            "Understand systematic naming rules"
        ],
        topics: [
            "IUPAC nomenclature",
            "Organic compounds",
            "Chemical naming"
        ],
        difficulty: "Beginner",
        estimatedTime: "1-2 hours"
    },
    "integration": {
        title: "Integration",
        subject: "Calculus",
        teacher: "BC sir",
        dueDate: "Due in 1 week",
        description: "Complete chapter 15.1",
        goals: [
            "Master integration techniques",
            "Complete Chapter 15.1 exercises",
            "Understand fundamental integration concepts"
        ],
        topics: [
            "Integration",
            "Calculus",
            "Chapter 15.1"
        ],
        difficulty: "Advanced",
        estimatedTime: "3-4 hours"
    },
    "desh ko maya": {
        title: "Desh ko maya",
        subject: "Nepali",
        teacher: "YB sir",
        dueDate: "Completed",
        description: "Poem lai suk suk",
        goals: [
            "Analyze Nepali poetry",
            "Understand literary devices",
            "Complete poem analysis"
        ],
        topics: [
            "Nepali literature",
            "Poetry analysis",
            "Literary devices"
        ],
        difficulty: "Intermediate",
        estimatedTime: "1-2 hours"
    },
    "soft storm": {
        title: "Soft Storm",
        subject: "English",
        teacher: "AG mam",
        dueDate: "Due in 2 weeks",
        description: "Analyze the poem",
        goals: [
            "Analyze English poetry",
            "Understand poetic devices",
            "Write comprehensive analysis"
        ],
        topics: [
            "English literature",
            "Poetry analysis",
            "Literary criticism"
        ],
        difficulty: "Intermediate",
        estimatedTime: "2-3 hours"
    }
};

// Function to search assignments by keyword
function searchAssignment(keyword) {
    const searchTerm = keyword.toLowerCase().trim();
    
    // Direct match
    if (assignmentsData[searchTerm]) {
        return assignmentsData[searchTerm];
    }
    
    // Partial match
    for (const [key, assignment] of Object.entries(assignmentsData)) {
        if (key.includes(searchTerm) || 
            assignment.title.toLowerCase().includes(searchTerm) ||
            assignment.subject.toLowerCase().includes(searchTerm) ||
            assignment.topics.some(topic => topic.toLowerCase().includes(searchTerm))) {
            return assignment;
        }
    }
    
    return null;
}

// Function to get all assignments
function getAllAssignments() {
    return Object.values(assignmentsData);
}

// Function to get assignments by subject
function getAssignmentsBySubject(subject) {
    return Object.values(assignmentsData).filter(assignment => 
        assignment.subject.toLowerCase() === subject.toLowerCase()
    );
} 